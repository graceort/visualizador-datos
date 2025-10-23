#!/usr/bin/env bash
set -euo pipefail

echo "▶ Fix ngModel (FormsModule) para ChartViewComponent"

# 1) Validaciones básicas
test -f angular.json || { echo "❌ No se encontró angular.json. Ejecuta este script en la raíz del proyecto."; exit 1; }

# 2) Localizar el componente ChartView
CHART_FILE="$(git ls-files 'src/app/**/chart-view.component.ts' | head -n1 || true)"
if [[ -z "${CHART_FILE}" ]]; then
  # fallback por si no está indexado en git
  CHART_FILE="$(ls src/app/**/chart-view.component.ts 2>/dev/null | head -n1 || true)"
fi
[[ -n "${CHART_FILE}" ]] || { echo "❌ No se encontró chart-view.component.ts"; exit 1; }

echo "✔ Componente: ${CHART_FILE}"

HTML_FILE="${CHART_FILE%.ts}.html"
[[ -f "${HTML_FILE}" ]] && echo "✔ Template: ${HTML_FILE}" || echo "⚠ No se encontró HTML (opcional)"

# 3) Detectar si es standalone
if grep -q "standalone:\s*true" "${CHART_FILE}"; then
  echo "🔵 Detectado componente STANDALONE"

  # 3a) Asegurar imports en el TS
  if ! grep -q '@angular/common' "${CHART_FILE}"; then
    sed -i '/@angular\/core/a import { CommonModule } from "@angular/common";' "${CHART_FILE}"
    echo "  + import CommonModule añadido"
  fi
  if ! grep -q '@angular/forms' "${CHART_FILE}"; then
    sed -i '/@angular\/core/a import { FormsModule } from "@angular/forms";' "${CHART_FILE}"
    echo "  + import FormsModule añadido"
  fi

  # 3b) Asegurar 'imports: [CommonModule, FormsModule]' en el decorador
  if grep -q "imports:\s*\[" "${CHART_FILE}"; then
    # Si ya hay imports, asegura que estén CommonModule y FormsModule
    if ! grep -q 'imports: \[[^]]*CommonModule' "${CHART_FILE}"; then
      sed -i 's/imports: \[\([^]]*\)\]/imports: [\1, CommonModule]/' "${CHART_FILE}"
      echo "  + CommonModule agregado al array imports"
    fi
    if ! grep -q 'imports: \[[^]]*FormsModule' "${CHART_FILE}"; then
      sed -i 's/imports: \[\([^]]*\)\]/imports: [\1, FormsModule]/' "${CHART_FILE}"
      echo "  + FormsModule agregado al array imports"
    fi
  else
    # No existe clave imports; la insertamos después de standalone:true
    sed -i 's/standalone:\s*true,*/&\
  imports: [CommonModule, FormsModule],/' "${CHART_FILE}"
    echo "  + imports: [CommonModule, FormsModule] insertado en el decorador"
  fi

else
  echo "🟢 Detectado componente EN MÓDULO (no standalone)"

  # 4) Encontrar el módulo que declara ChartViewComponent
  MODULE_FILE="$(grep -rl 'declarations:\s*\[[^]]*ChartViewComponent' src/app --include='*.module.ts' | head -n1 || true)"
  if [[ -z "${MODULE_FILE}" ]]; then
    # fallback: app.module.ts
    if [[ -f src/app/app.module.ts ]]; then
      MODULE_FILE="src/app/app.module.ts"
      echo "  ⚠ No se halló declaración explícita; usando ${MODULE_FILE}"
    else
      echo "❌ No se encontró ningún *.module.ts"
      exit 1
    fi
  fi
  echo "✔ Módulo: ${MODULE_FILE}"

  # 4a) Importar FormsModule si no está
  if ! grep -q 'FormsModule' "${MODULE_FILE}"; then
    # Intentar insertar después de platform-browser; si no existe, insertar tras la primera línea import
    if grep -q '@angular/platform-browser' "${MODULE_FILE}"; then
      sed -i '/@angular\/platform-browser/a import { FormsModule } from "@angular/forms";' "${MODULE_FILE}"
    else
      sed -i '0,/^import /s//import { FormsModule } from "@angular\/forms";\
&/' "${MODULE_FILE}"
    fi
    echo "  + import FormsModule añadido en ${MODULE_FILE}"
  fi

  # 4b) Asegurar FormsModule dentro de imports: [...]
  if grep -q 'imports:\s*\[' "${MODULE_FILE}"; then
    if ! grep -q 'imports:\s*\[[^]]*FormsModule' "${MODULE_FILE}"; then
      sed -i 's/imports: \[\([^]]*\)\]/imports: [\1, FormsModule]/' "${MODULE_FILE}"
      echo "  + FormsModule agregado al array imports del módulo"
    else
      echo "  = FormsModule ya estaba en imports del módulo"
    fi
  else
    echo "  ⚠ No se encontró la sección imports: [] en el módulo. Revisa manualmente."
  fi
fi

# 5) (Opcional) Añadir name="country" al <select> con ngModel para evitar warnings
if [[ -f "${HTML_FILE}" ]] && grep -q '\[\(ngModel\)\]' "${HTML_FILE}"; then
  if ! grep -q '<select[^>]*name=' "${HTML_FILE}"; then
    # Inserta name="country" en el primer <select ...[(ngModel)]...>
    sed -i '0,/<select /s//<select name="country" /' "${HTML_FILE}"
    echo "  + name=\"country\" agregado al <select> en ${HTML_FILE}"
  fi
fi

echo "✅ Arreglo aplicado."
echo "🚀 Iniciando servidor de desarrollo en puerto 4300..."
ng serve --port 4300 -o
