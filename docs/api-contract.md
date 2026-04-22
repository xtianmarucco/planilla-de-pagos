# 🌐 API Design Rules

This document defines how the backend API must be designed and implemented.

All endpoints must follow these rules strictly.

---

# 🧱 General Principles

- Use RESTful conventions
- Use JSON for all requests and responses
- Keep responses consistent across all endpoints

---

# 📍 Base URL

/api

---

# 📚 Resource Naming

- Use plural nouns:

  /clients
  /payments

- Use lowercase and hyphen-case if needed

---

# 🔗 Endpoints Structure

## Clients

GET    /clients
GET    /clients/:id
POST   /clients
PUT    /clients/:id
DELETE /clients/:id

---

## Payments

GET    /payments
POST   /payments

Filters must be passed as query params:

/payments?client_id=1&from=2026-01-01&to=2026-01-31

---

# 📥 Request Format

- Always use JSON body for POST/PUT

Example:

POST /payments

{
  "client_id": 1,
  "amount": 10000,
  "payment_date": "2026-04-01",
  "payment_method": "EFECTIVO",
  "notes": "Pago parcial"
}

---

# 📤 Response Format (SUCCESS)

All successful responses must follow this structure:

{
  "success": true,
  "data": ...
}

---

## Examples

Single resource:

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Juan Perez"
  }
}

List:

{
  "success": true,
  "data": [
    { "id": 1 },
    { "id": 2 }
  ]
}

---

# ❌ Error Response Format

All errors must follow this structure:

{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}

---

## Common Error Codes

- VALIDATION_ERROR
- NOT_FOUND
- UNAUTHORIZED
- INTERNAL_ERROR

---

# 📊 Filtering Rules

- Use query params for filtering
- Never use body for filters

Example:

/payments?client_id=1&from=2026-04-01&to=2026-04-30

---

# 📅 Date Handling

- Use ISO format: YYYY-MM-DD
- Backend must validate dates

---

# 🔢 Status Codes

- 200 → success
- 201 → resource created
- 400 → validation error
- 401 → unauthorized
- 404 → not found
- 500 → internal error

---

# 🔐 Authentication

- Use session-based authentication
- Protected routes must require a valid session
- Return 401 if user is not authenticated

---

# 🧠 Backend Behavior Rules

- Always validate input
- Always return consistent responses
- Never expose internal errors directly

---

# 🚫 What to Avoid

- Do NOT return raw database responses
- Do NOT use inconsistent formats
- Do NOT mix different response structures

---

# 🎯 Goal

Create a predictable and consistent API
that is easy to consume from the frontend.