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

# 📁 Folder Structure

src/
  controllers/
  services/
  repositories/
  routes/
  middlewares/
  utils/

---

# 🔐 Authentication

- Use express-session for authentication
- Store userId in session
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
- Return