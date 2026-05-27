export function saveSession(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getSession() {
  return JSON.parse(localStorage.getItem('user'))
}

export function removeSession() {
  localStorage.removeItem('user')
}
