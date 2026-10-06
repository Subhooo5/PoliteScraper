import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

const HASH_FILE = 'output/hashes.json'

function hashRecord(record) {
  const { fetched_at, ...content } = record
  return createHash('sha256').update(JSON.stringify(content)).digest('hex')
}

export async function detectChanges(records) {
  const previous = existsSync(HASH_FILE) ? JSON.parse(await readFile(HASH_FILE, 'utf-8')) : {}
  const current = {}
  const summary = { new: 0, changed: 0, unchanged: 0, gone: 0 }

  for (const record of records) {
    const hash = hashRecord(record)
    current[record.product_url] = hash
    if (!(record.product_url in previous)) {
      summary.new += 1
    } 
    else if (previous[record.product_url] !== hash) {
      summary.changed += 1
    } 
    else {
      summary.unchanged += 1
    }
  }

  for (const url of Object.keys(previous)) {
    if (!(url in current)) {
      summary.gone += 1
    }
  }
  
  await writeFile(HASH_FILE, JSON.stringify(current, null, 2))
  return summary
}