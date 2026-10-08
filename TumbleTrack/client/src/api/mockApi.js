// The simulated backend — same function names and shapes as httpApi.js,
// so components can't tell the difference. Data lives only in the
// visitor's own browser.

import seed from './seed.json'

const LOADS_KEY = 'final-project:loads'
const CLOTHING_KEY = 'final-project:clothing'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read(key, seedValue) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(key)
    }
  }
  localStorage.setItem(key, JSON.stringify(seedValue))
  return seedValue
}

function write(key, rows) {
  localStorage.setItem(key, JSON.stringify(rows))
  return rows
}

// ---- loads ----

export async function listLoads() {
  await delay()
  return read(LOADS_KEY, seed.loads)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function createLoad(input) {
  await delay()
  const created = { ...input, id: crypto.randomUUID() }
  const rows = [created, ...read(LOADS_KEY, seed.loads)]
  write(LOADS_KEY, rows)

  // Mirror the server's behaviour: tag clothing items with this date.
  if (created.clothingIds?.length) {
    const clothingRows = read(CLOTHING_KEY, seed.clothing).map((item) =>
      created.clothingIds.includes(item.id)
        ? { ...item, last_washed_date: created.date }
        : item
    )
    write(CLOTHING_KEY, clothingRows)
  }

  return created
}

export async function deleteLoad(id) {
  await delay()
  write(LOADS_KEY, read(LOADS_KEY, seed.loads).filter((row) => String(row.id) !== String(id)))
}

// ---- clothing ----

export async function listClothing() {
  await delay()
  return read(CLOTHING_KEY, seed.clothing).slice()
}

export async function createClothing(input) {
  await delay()
  const created = {
    ...input,
    id: crypto.randomUUID(),
    last_washed_date: input.lastWashedDate || new Date().toISOString().slice(0, 10),
  }
  write(CLOTHING_KEY, [created, ...read(CLOTHING_KEY, seed.clothing)])
  return created
}

export async function deleteClothing(id) {
  await delay()
  write(CLOTHING_KEY, read(CLOTHING_KEY, seed.clothing).filter((row) => String(row.id) !== String(id)))
}
