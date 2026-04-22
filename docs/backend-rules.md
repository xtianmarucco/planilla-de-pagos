# 🧱 Backend Architecture Rules

We use a layered architecture:

- controllers → handle HTTP requests/responses
- services → contain business logic
- repositories → interact with database

---

# ❗ Critical Rules

- NEVER put business logic inside controllers
- Controllers must be thin
- Services must contain all business logic
- Repositories must only handle database queries

---

# 🗄️ Database — Prisma is the only ORM

- **ALL** database access goes through Prisma (`src/lib/prisma.js`)
- Never use `pg` directly for application queries — Prisma is the source of truth
- `pg` is only used by `connect-pg-simple` for the session store (infrastructure, not app data)
- The single connection variable is `DATABASE_URL`; never use the individual `DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD` variables
- Schema lives in `backend/prisma/schema.prisma` — that file is authoritative
- After any schema change run `prisma migrate dev` (dev) or `prisma migrate deploy` (prod)
- `src/db/migrations.sql` is a reference script for fresh Supabase installs; keep it in sync with the Prisma schema

---

# 📁 Folder Structure

src/
  controllers/
  services/
  repositories/
  routes/
  middlewares/
  lib/          ← prisma.js lives here
  utils/

---

# 🔐 Authentication

- Use express-session for authentication
- Sessions are stored in PostgreSQL via `connect-pg-simple` (table: `session`)
- `SESSION_SECRET` must be set as an env var; the app throws on startup in production if it is missing
- Store `userId` in session
- Use middleware to protect routes

---

# 📦 API Design Rules

- Use REST conventions
- Use plural resource names:

  /clients
  /payments

---

# 📥 Request Validation

- Always validate input data
- Never trust client input
- Return meaningful error messages with appropriate HTTP status codes
