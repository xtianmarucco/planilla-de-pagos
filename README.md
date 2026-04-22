# Planilla de Pagos Online

Sistema de gestión de pagos de empleados. Monorepo con backend Node.js/Express/PostgreSQL y frontend Vue 3/Vite/Pinia.

## Estructura

```
/
├── backend/         Node.js + Express + PostgreSQL
├── frontend/        Vue 3 + Vite + Pinia
└── docs/            Reglas de arquitectura y contrato de API
```

## Requisitos

- Node.js >= 20
- npm >= 9
- PostgreSQL >= 15

## Levantar el proyecto

### 1. Base de datos

```bash
# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE planilla_pagos;"

# Ejecutar las migraciones
psql -U postgres -d planilla_pagos -f backend/src/db/migrations.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # completar con tus credenciales reales
npm run dev            # corre en http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # corre en http://localhost:5173
```

El frontend hace proxy de `/api` al backend automáticamente via Vite (ver `vite.config.js`).

## Verificar que todo funciona

```bash
curl http://localhost:3000/health
# {"status":"ok","db":"connected","timestamp":"..."}
```

## Scripts disponibles

| Directorio | Comando           | Descripción                    |
|------------|-------------------|--------------------------------|
| backend    | `npm run dev`     | Servidor con hot-reload        |
| backend    | `npm start`       | Servidor en producción         |
| frontend   | `npm run dev`     | Dev server con HMR             |
| frontend   | `npm run build`   | Build de producción            |
| frontend   | `npm run preview` | Preview del build              |

## Documentación

- [Reglas de backend](docs/backend-rules.md)
- [Reglas de frontend](docs/frontend-rules.md)
- [Contrato de API](docs/api-contract.md)

## Variables de entorno (backend)

Ver [backend/.env.example](backend/.env.example) para la lista completa.

## Decisiones de arquitectura

- **Sin ORM**: SQL crudo con `pg` para control total y aprendizaje explícito de las queries.
- **Arquitectura en capas**: separación clara entre routing, lógica de negocio y acceso a datos.
- **Fetch nativo**: sin Axios en el frontend para mantener dependencias mínimas.
- **Pinia Composition API**: stores como funciones setup para consistencia con Vue 3.
- **Proxy Vite**: el frontend llama a `/api` y Vite lo redirige al backend en desarrollo, sin CORS issues.
# planilla-de-pagos
