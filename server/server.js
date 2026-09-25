import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as loads from './loadsRepo.js'
import * as clothing from './clothingRepo.js'

const app = express()

// CORS before the routes. Name your origins — app.use(cors()) with no
// options sends Access-Control-Allow-Origin: *, which lets any site call
// this API from a visitor's browser.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: '100kb' }))

// This app has no login, and once a database is attached it's a live,
// writable public URL. Gate everything behind HTTP Basic Auth so a random
// visitor can't POST/DELETE data. /healthz is left open so Render's own
// health checks (which send no credentials) keep working.
//
// BASIC_AUTH_USER / BASIC_AUTH_PASS live only in environment variables —
// your local .env (git-ignored) and your host's settings panel. Never in
// source, never in the public repo. Share the real values with graders
// only through a private channel (e.g. your course workspace README),
// never in the repository itself.
function requireBasicAuth(request, response, next) {
  const header = request.header('authorization') || ''
  const [scheme, encoded] = header.split(' ')

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    const separatorIndex = decoded.indexOf(':')
    const user = decoded.slice(0, separatorIndex)
    const pass = decoded.slice(separatorIndex + 1)

    if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
      return next()
    }
  }

  response.set('WWW-Authenticate', 'Basic realm="TumbleTrack"')
  response.status(401).json({ error: 'Authentication required' })
}

app.use((request, response, next) => {
  if (request.path === '/healthz') return next()
  return requireBasicAuth(request, response, next)
})

// No accounts: every request must carry an X-Device-Id header, generated
// and stored by the client on first launch. This is the app's only
// ownership boundary — every repo query filters by it.
app.use((request, response, next) => {
  const deviceId = request.header('x-device-id')
  if (!deviceId || deviceId.length > 100) {
    return response.status(400).json({ error: 'Missing or invalid X-Device-Id header' })
  }
  request.deviceId = deviceId
  next()
})

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

// Validation lives on the server because the client can be bypassed.
function validateLoad(body) {
  const errors = []
  const date = typeof body.date === 'string' ? body.date.trim() : ''
  const loadType = typeof body.loadType === 'string' ? body.loadType.trim() : ''
  const weight = Number(body.weight)
  const cost = Number(body.cost)
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  const clothingIds = Array.isArray(body.clothingIds)
    ? body.clothingIds.map(Number).filter(Number.isInteger)
    : []

  if (!date) errors.push('date is required')
  if (!loadType) errors.push('loadType is required')
  if (loadType.length > 40) errors.push('loadType must be 40 characters or fewer')
  if (!(weight > 0)) errors.push('weight must be a positive number')
  if (!(cost >= 0)) errors.push('cost must be zero or a positive number')
  if (notes.length > 500) errors.push('notes must be 500 characters or fewer')

  return {
    errors,
    value: { date, loadType, weight, weightUnit: 'kg', cost, notes, clothingIds },
  }
}

function validateClothing(body) {
  const errors = []
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const category = typeof body.category === 'string' ? body.category.trim() : ''
  const lastWashedDate = typeof body.lastWashedDate === 'string' ? body.lastWashedDate.trim() : ''

  if (!name) errors.push('name is required')
  if (name.length > 120) errors.push('name must be 120 characters or fewer')
  if (category.length > 40) errors.push('category must be 40 characters or fewer')

  return { errors, value: { name, category, lastWashedDate } }
}

// ---- loads ----

app.get('/api/loads', async (request, response, next) => {
  try {
    response.json(await loads.getAll(request.deviceId))
  } catch (error) { next(error) }
})

app.post('/api/loads', async (request, response, next) => {
  const { errors, value } = validateLoad(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await loads.create(request.deviceId, value))
  } catch (error) { next(error) }
})

app.delete('/api/loads/:id', async (request, response, next) => {
  try {
    const removed = await loads.remove(request.deviceId, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) { next(error) }
})

// ---- clothing ----

app.get('/api/clothing', async (request, response, next) => {
  try {
    response.json(await clothing.getAll(request.deviceId))
  } catch (error) { next(error) }
})

app.post('/api/clothing', async (request, response, next) => {
  const { errors, value } = validateClothing(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await clothing.create(request.deviceId, value))
  } catch (error) { next(error) }
})

app.delete('/api/clothing/:id', async (request, response, next) => {
  try {
    const removed = await clothing.remove(request.deviceId, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) { next(error) }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
