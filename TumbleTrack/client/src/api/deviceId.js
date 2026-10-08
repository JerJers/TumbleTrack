// No accounts: each browser gets a random ID on first visit, stored in
// localStorage, and sent as X-Device-Id with every real API request. The
// server tags all rows with it, so each device only ever sees its own data.

const KEY = 'tumbletrack:device-id'

export function getDeviceId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}
