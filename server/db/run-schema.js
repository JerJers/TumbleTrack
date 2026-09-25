// One-off script: applies schema.sql to whatever DATABASE_URL points at.
// Usage:  node --env-file=.env db/run-schema.js
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { pool } from './pool.js'

const here = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(here, 'schema.sql'), 'utf-8')

try {
  await pool.query(sql)
  console.log('Schema applied successfully.')
} catch (error) {
  console.error('Failed to apply schema:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
