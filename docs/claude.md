# 🧠 Project Overview

This is an internal web application to manage payment records for an ice cream business.

Main goals:
- Register payments
- Filter payments by client, date, and period (monthly)
- View totals per client

The system must be simple, fast, and easy to use in a real business environment.

---

# ⚙️ Tech Stack

Frontend:
- Vue 3
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express

Database:
- PostgreSQL (Supabase for development)

Authentication:
- Session-based authentication (no JWT)
- Password hashing using bcrypt

---

# 📊 Core Concepts

- Clients have a type: MAYORISTA or VIABANA
- Payments belong to a client
- Payments include a payment method (EFECTIVO, TRANSFERENCIA, OTRO)
- The system focuses only on payments (no debt tracking for now)

---

# 🧠 AI Behavior Rules

- Always follow the architecture rules defined in BACKEND_RULES.md and FRONTEND_RULES.md
- Do not introduce new technologies unless explicitly requested
- Prioritize simplicity over complexity
- Always generate clean, production-ready code
- If something is unclear, ask for clarification before making assumptions

---

# 🎯 Development Philosophy

- Keep it simple
- Build only what is necessary (MVP first)
- Focus on real usability
- Avoid over-engineering

# 🔗 API Contract

All API design must follow the rules defined in API_RULES.md


# CLAUDE.md - Token Efficient Rules

1.⁠ ⁠Think before acting. Read existing files before writing code.
2.⁠ ⁠Be concise in output but thorough in reasoning.
3.⁠ ⁠Prefer editing over rewriting whole files.
4.⁠ ⁠Do not re-read files you have already read unless the file may have changed.
5.⁠ ⁠Test your code before declaring done.
6.⁠ ⁠No sycophantic openers or closing fluff.
7.⁠ ⁠Keep solutions simple and direct.
8.⁠ ⁠User instructions always override this file.

# 🎨 UI Rules

All frontend UI must follow ui-rules.md