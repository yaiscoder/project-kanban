const BASE = import.meta.env.VITE_API_URL

export async function getTasks() {
  const res = await fetch(`${BASE}/tasks`)
  return res.json()
}

export async function getUsers() {
  const res = await fetch(`${BASE}/users`)
  return res.json()
}

export async function createTask(data) {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' })
  return res.json()
}
