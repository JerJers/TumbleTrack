import { pool } from './db/pool.js'

export async function getAll(deviceId) {
  const result = await pool.query(
    `SELECT id, name, category, last_washed_date AS "lastWashedDate"
     FROM clothing
     WHERE device_id = $1
     ORDER BY created_at DESC`,
    [deviceId]
  )
  return result.rows
}

export async function create(deviceId, { name, category, lastWashedDate }) {
  const result = await pool.query(
    `INSERT INTO clothing (device_id, name, category, last_washed_date)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
     RETURNING id, name, category, last_washed_date AS "lastWashedDate"`,
    [deviceId, name, category ?? '', lastWashedDate || null]
  )
  return result.rows[0]
}

export async function remove(deviceId, id) {
  const result = await pool.query(
    'DELETE FROM clothing WHERE id = $1 AND device_id = $2 RETURNING id',
    [id, deviceId]
  )
  return result.rowCount > 0
}
