// The real client. Every function here talks to YOUR Express API.

import { getDeviceId } from './deviceId.js'

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    credentials: 'include', // required for the browser's Basic Auth prompt to work cross-origin
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Id': getDeviceId(),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listLoads = () => request('/api/loads')

export const createLoad = (input) =>
  request('/api/loads', { method: 'POST', body: JSON.stringify(input) })

export const deleteLoad = (id) =>
  request(`/api/loads/${id}`, { method: 'DELETE' })

export const listClothing = () => request('/api/clothing')

export const createClothing = (input) =>
  request('/api/clothing', { method: 'POST', body: JSON.stringify(input) })

export const deleteClothing = (id) =>
  request(`/api/clothing/${id}`, { method: 'DELETE' })
