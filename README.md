# Visualizador de Datos y Rendimiento

Proyecto en Angular 18 con PrimeFlex y PrimeNG. Consume múltiples APIs y presenta visualizaciones como diagramas de pastel para una optima visualización estadística de datos.

## Tecnologías
- Angular 18
- PrimeNG + PrimeFlex
- Chart.js
- APIs públicas (COVID, clima)

## Estructura

src/
├── app/
│   ├── components/
│   │   ├── home/
│   │   ├── chart-view/
│   │   ├── api-dashboard/
│   ├── services/
│   │   └── api.service.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   ├── app.component.ts / .html / .scss
│   ├── app.config.ts
├── main.ts
├── index.html
├── polyfills.ts

## Instalación

1. Clona el repositorio:

git clone https://github.com/graceort/visualizador-datos.git
cd visualizador-datos

2. Instala las dependencias:
npm install

3. Ejecuta el proyecto:
ng serve --host 0.0.0.0

4. Abre en tu navegador:
http://localhost:4200

