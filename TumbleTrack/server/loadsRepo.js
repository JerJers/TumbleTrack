// Data-access layer for laundry loads, backed by Postgres (Neon).
// Every query is parameterised, and every query carries
// "WHERE device_id = $1" — the ownership check lives IN the query.

import { pool } from './db/pool.js'

export async function getAll(deviceId) {
  const result = await pool.query(
    `SELECT id, load_date AS date, load_type AS "loadType", weight,
            weight_unit AS "weightUnit", cost, notes, clothing_ids AS "clothingIds"
     FROM loads
     WHERE device_id = $1
     ORDER BY load_date DESC, id DESC`,
    [deviceId]
  )
  return result.rows
}

export async function create(deviceId, { date, loadType, weight, weightUnit, cost, notes, clothingIds }) {
  const result = await pool.query(
    `INSERT INTO loads (device_id, load_date, load_type, weight, weight_unit, cost, notes, clothing_ids)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, load_date AS date, load_type AS "loadType", weight,
               weight_unit AS "weightUnit", cost, notes, clothing_ids AS "clothingIds"`,
    [deviceId, date, loadType, weight, weightUnit ?? 'kg', cost, notes ?? '', clothingIds ?? []]
  )
  const newLoad = result.rows[0]

  if (newLoad.clothingIds.length > 0) {
    await pool.query(
      `UPDATE clothing
       SET last_washed_date = $1
       WHERE device_id = $2 AND id = ANY($3::int[])`,
      [newLoad.date, deviceId, newLoad.clothingIds]
    )
  }

  return newLoad
}

export async function remove(deviceId, id) {
  const result = await pool.query(
    'DELETE FROM loads WHERE id = $1 AND device_id = $2 RETURNING id',
    [id, deviceId]
  )
  return result.rowCount > 0
}
