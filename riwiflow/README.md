# Riwiflow

Kanban task manager with role-based access.

## Setup

```bash
npm install
```

## Run

Open two terminals:

```bash
# Terminal 1 — API
npm run server

# Terminal 2 — App
npm run dev
```

Then open `http://localhost:5173`

## Test accounts

| Email | Password | Role |
|-------|----------|------|
| admin@mail.com | 123456 | admin |
| coder@mail.com | 123456 | coder |
| sara@mail.com  | 123456 | coder |

## Roles

**Admin** — create tasks, edit any task, delete tasks, assign tasks to users

**Coder** — view all tasks, edit only their own tasks (description + status), drag their own tasks
