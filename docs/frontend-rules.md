# 🎨 Frontend Architecture Rules

We are building a responsive web application using Vue 3.

The frontend must be:
- simple
- fast
- clean
- easy to maintain

---

# ⚙️ Tech Stack

- Vue 3 (Composition API)
- Tailwind CSS
- Pinia (global state management)
- Native fetch API (wrapped in a custom service)

---

# 🧱 Project Structure

src/
  components/
  views/
  layouts/
  stores/
  services/
  router/

---

# 🧠 State Management (Pinia)

- Use Pinia for global state
- Do NOT use global reactive variables outside Pinia
- Keep stores clean and focused

Example stores:
- authStore
- clientsStore
- paymentsStore

---

# 🌐 API Layer

- DO NOT call fetch directly inside components
- Always use a service layer

Example:
- services/apiClient.js
- services/paymentsService.js
- services/clientsService.js

---

# 📦 API Client Rules

- Create a centralized API client using fetch
- Handle:
  - base URL
  - headers
  - error handling

---

# ❗ Critical Rules

- NEVER mix business logic inside components
- Components should be as dumb as possible
- Keep logic inside:
  - stores
  - services

---

# 🧩 Components

- Must be reusable
- Must be small and focused
- Avoid large monolithic components

---

# 📄 Views

- Represent pages
- Can orchestrate components
- Should not contain heavy logic

---

# 🔁 Data Flow

- View → calls store
- Store → calls service
- Service → calls API

---

# 🎯 UX Rules

This is an internal tool used in a real business.

Priorities:
- speed
- clarity
- minimal clicks

---

# 📱 Responsive Design

- Mobile-first approach
- Must work well on phones (important)

---

# 🎨 Styling Rules

- Use Tailwind CSS
- Avoid custom CSS unless necessary
- Keep consistent spacing and layout

---

# 🔐 Authentication Handling

- Store session state in Pinia
- Check authentication on app load
- Redirect unauthorized users

---

# 🚫 What to Avoid

- Do NOT use unnecessary libraries
- Do NOT over-engineer components
- Do NOT duplicate logic

---

# 🧠 Code Style

- Use clear and descriptive names
- Prefer Composition API
- Use async/await (no .then chains)
- Handle errors properly

---

# 🎯 Goal

Build a fast, clean, and maintainable UI
that helps register and visualize payments efficiently.