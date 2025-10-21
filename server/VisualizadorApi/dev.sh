#!/usr/bin/env bash
set -euo pipefail

FRONT_PORT="${FRONT_PORT:-4201}"
API_PORT="${API_PORT:-5159}"
API_DIR="server/VisualizadorApi"
PROXY_FILE="proxy.conf.json"

log()  { printf "\n\033[1;36m[dev]\033[0m %s\n" "$*"; }
warn() { printf "\n\033[1;33m[warn]\033[0m %s\n" "$*"; }
err()  { printf "\n\033[1;31m[err]\033[0m %s\n" "$*"; }

is_port_in_use() { lsof -i TCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
kill_port() {
  local port="$1"
  if is_port_in_use "$port"; then
    log "Liberando puerto $port…"
    lsof -t -i TCP:"$port" -sTCP:LISTEN | xargs -r kill -9 || true
    sleep 0.5
  fi
}
wait_for_port() {
  local port="$1" name="$2" tries=60
  until is_port_in_use "$port"; do
    ((tries--)) || { err "Tiempo de espera agotado esperando $name en :$port"; return 1; }
    sleep 0.5
  done
}

print_urls() {
  if [[ "${CODESPACES:-}" == "true" && -n "${CODESPACE_NAME:-}" ]]; then
    local front="https://${FRONT_PORT}-${CODESPACE_NAME}.githubpreview.dev"
    local api_swagger="https://${API_PORT}-${CODESPACE_NAME}.githubpreview.dev/swagger"
    local api_via_front="${front}/api/solicitudes"
    log "Front (Angular):  ${front}"
    log "API (Swagger):    ${api_swagger}"
    log "API via proxy (/api/solicitudes): ${api_via_front}"
  else
    log "Front (Angular):  http://localhost:${FRONT_PORT}"
    log "API (Swagger):    http://localhost:${API_PORT}/swagger"
    log "API via proxy (/api/solicitudes): http://localhost:${FRONT_PORT}/api/solicitudes"
  fi
}

ensure_proxy() {
  if [[ ! -f "${PROXY_FILE}" ]]; then
    log "Creando ${PROXY_FILE} apuntando a http://localhost:${API_PORT}"
    cat > "${PROXY_FILE}" <<JSON
{
  "/api": {
    "target": "http://localhost:${API_PORT}",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
JSON
  else
    log "proxy.conf.json ya existe ✔"
  fi
}

start_api() {
  if [[ ! -d "${API_DIR}" ]]; then
    err "No se encontró ${API_DIR}. Crea primero la API .NET (server/VisualizadorApi)."
    err "Si quieres, puedo generarla con dotnet new. Dímelo y te doy el bloque."
    exit 1
  fi
  pushd "${API_DIR}" >/dev/null
  log "Compilando API (.NET 8)…"
  dotnet restore >/dev/null
  dotnet build -c Debug >/dev/null

  log "Levantando API en 0.0.0.0:${API_PORT}…"
  # Ejecuta en background y captura el PID
  dotnet run --no-launch-profile --urls "http://0.0.0.0:${API_PORT}" >/tmp/api.out 2>/tmp/api.err &
  API_PID=$!
  popd >/dev/null

  trap 'log "Cerrando API (PID ${API_PID})…"; kill -9 ${API_PID} >/dev/null 2>&1 || true' EXIT

  wait_for_port "${API_PORT}" "API"
  log "API arriba ✔ (PID ${API_PID})"
}

start_front() {
  log "Levantando Angular en 0.0.0.0:${FRONT_PORT} con proxy…"
  # ng serve queda en foreground (Ctrl+C para salir)
  ng serve --host 0.0.0.0 --port "${FRONT_PORT}" --proxy-config "${PROXY_FILE}"
}

main() {
  kill_port "${FRONT_PORT}"
  kill_port "${API_PORT}"

  ensure_proxy
  print_urls

  # Tips de entorno
  if [[ "${CODESPACES:-}" == "true" ]]; then
    log "Detectado Codespaces: usa las URLs *.githubpreview.dev impresas arriba."
  fi

  start_api
  print_urls
  start_front
}

main "$@"
