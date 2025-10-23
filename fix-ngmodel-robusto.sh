#!/usr/bin/env bash
set -euo pipefail

echo "▶ Localizando módulos que declaran ChartViewComponent…"

# Encuentra el/los *.module.ts que tengan a ChartViewComponent en declarations
mapfile -t MODULES < <(grep -rl 'declarations:\s*\[[^]]*ChartViewComponent' src/app --include='*.module.ts' || true)

if [[ ${#MODULES[@]} -eq 0 ]]; then
  echo "⚠ No se halló declaración explícita. Intentando con app.module.ts como fallback…"
  if [[ -f src/app/app.module.ts ]]; then
    MODULES=(src/app/app.module.ts)
  else
    echo "❌ No se encontró ningún módulo. Revisa tu estructura."
    exit 1
  fi
fi

for MODULE_FILE in "${MODULES[@]}"; do
  echo "✔ Módulo objetivo: $MODULE_FILE"

  # Asegurar import FormsModule
  if ! grep -q 'FormsModule' "$MODULE_FILE"; then
    # Insertar import { FormsModule } from '@angular/forms';
    sed -i '0,/^import /s//import { FormsModule } from "@angular\/forms";\
&/' "$MODULE_FILE"
    echo "  + import FormsModule añadido"
  fi

  # Asegurar import CommonModule si es módulo de feature (no AppModule)
  if [[ "$MODULE_FILE" != *"app.module.ts" ]]; then
    if ! grep -q 'CommonModule' "$MODULE_FILE"; then
      sed -i '0,/^import /s//import { CommonModule } from "@angular\/common";\
&/' "$MODULE_FILE"
      echo "  + import CommonModule añadido"
    fi
  fi

  # Asegurar que FormsModule esté en imports:[]
  if grep -q 'imports:\s*\[' "$MODULE_FILE"; then
    if ! grep -q 'imports:\s*\[[^]]*FormsModule' "$MODULE_FILE"; then
      sed -i 's/imports: \[\([^]]*\)\]/imports: [\1, FormsModule]/' "$MODULE_FILE"
      echo "  + FormsModule agregado a imports[]"
    else
      echo "  = FormsModule ya estaba en imports[]"
    fi
  else
    echo "  ⚠ No se encontró sección imports:[] en $MODULE_FILE — revísalo manualmente si persiste el error."
  fi

  # Asegurar que CommonModule esté en imports[] de módulos de feature
  if [[ "$MODULE_FILE" != *"app.module.ts" ]] && grep -q 'imports:\s*\[' "$MODULE_FILE"; then
    if ! grep -q 'imports:\s*\[[^]]*CommonModule' "$MODULE_FILE"; then
      sed -i 's/imports: \[\([^]]*\)\]/imports: [\1, CommonModule]/' "$MODULE_FILE"
      echo "  + CommonModule agregado a imports[]"
    fi
  fi

done

# (Opcional) Evitar warning del name= en el <select> con ngModel
HTML_FILE="$(git ls-files 'src/app/**/chart-view.component.html' | head -n1 || true)"
if [[ -n "${HTML_FILE}" && -f "${HTML_FILE}" ]]; then
  if grep -q '\[\(ngModel\)\]' "${HTML_FILE}" && ! grep -q '<select[^>]*name=' "${HTML_FILE}"; then
    sed -i '0,/<select /s//<select name="country" /' "${HTML_FILE}"
    echo "  + name=\"country\" agregado al <select> (${HTML_FILE})"
  fi
fi

echo "✅ Listo. Levantando en puerto 4301 para evitar conflictos…"
ng serve --port 4301 -o
