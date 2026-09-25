import pg from 'pg'

// DATABASE_URL comes from your host's environment variables (Render
// dashboard) or a local .env — never hardcoded, never committed.
// Neon requires SSL; rejectUnauthorized:false is what makes the pg driver
// accept Neon's certificate without you installing a CA bundle yourself.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
