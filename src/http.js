import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const USER_AGENT = 'FlyRankInternshipA9/1.0 (+https://github.com/Subhooo5/PoliteScraper)'
const TIMEOUT_MS = 8000

export const stats = { fetched: 0, cacheHits: 0, failedPages: 0 }

export async function getPage(url, cacheName) {
  const file = `cache/${cacheName}`
  if (existsSync(file)) {
    const html = await readFile(file, 'utf-8')
    const { mtime } = await stat(file)
    stats.cacheHits += 1
    console.log(`CACHE HIT ${url} ${Buffer.byteLength(html)} bytes`)
    return { html, fetchedAt: mtime.toISOString() }
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })

  if (response.status !== 200) {
    throw new Error(`Request failed with status ${response.status} for ${url}`)
  }
  
  const html = await response.text()
  await mkdir('cache', { recursive: true })
  await writeFile(file, html)
  stats.fetched += 1
  console.log(`FETCH ${url} ${Buffer.byteLength(html)} bytes`)
  return { html, fetchedAt: new Date().toISOString() }
}