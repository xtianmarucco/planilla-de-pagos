# Planilla de Pagos Online

Sistema de gestión de pagos de empleados. Monorepo con backend Node.js/Express/PostgreSQL (Prisma) y frontend Vue 3/Vite/Pinia.

## Estructura

```
/
├── backend/         Node.js + Express + PostgreSQL (Prisma)
├── frontend/        Vue 3 + Vite + Pinia
└── docs/            Reglas de arquitectura y contrato de API
```

## Requisitos

- Node.js >= 20
- npm >= 9
- PostgreSQL >= 15 (en desarrollo se usa Supabase)

## Levantar el proyecto

### 1. Base de datos

La app usa Prisma como ORM. Configurá `DATABASE_URL` en `backend/.env` apuntando a tu instancia de PostgreSQL (por ejemplo, un proyecto de Supabase) y aplicá las migraciones:

```bash
cd backend
npx prisma migrate deploy
```

`backend/src/db/migrations.sql` queda como script de referencia equivalente para instalaciones limpias en Supabase, pero el schema autoritativo es [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

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

- **Prisma como único ORM**: todo el acceso a datos pasa por `src/lib/prisma.js`; `pg` solo se usa internamente para el store de sesiones (`connect-pg-simple`).
- **Arquitectura en capas**: separación clara entre routing, lógica de negocio y acceso a datos.
- **Fetch nativo**: sin Axios en el frontend para mantener dependencias mínimas.
- **Pinia Composition API**: stores como funciones setup para consistencia con Vue 3.
- **Proxy Vite**: el frontend llama a `/api` y Vite lo redirige al backend en desarrollo, sin CORS issues.
# planilla-de-pagos
