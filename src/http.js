import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const USER_AGENT = 'FlyRankInternshipA9/1.0 (+https://github.com/Subhooo5/PoliteScraper)'
const TIMEOUT_MS = 8000
const DELAY_MS = 600
const MAX_ATTEMPTS = 4
const BASE_BACKOFF_MS = 1000
const RETRY_WAIT_MS = 2000

export const stats = { fetched: 0, cacheHits: 0, failedPages: 0 }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function log(fields) {
  console.log(JSON.stringify({ time: new Date().toISOString(), ...fields }))
}

async function request(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })

  if (response.status !== 200) {
    const error = new Error(`Request failed with status ${response.status} for ${url}`)
    error.status = response.status
    error.retryAfter = response.headers.get('retry-after')
    throw error
  }
  
  return response.text()
}

function isRetryable(error) {
  return error.status === 429 || error.status >= 500 || error.name === 'TimeoutError'
}

function waitTime(error, attempt) {
  if (error.retryAfter) {
    const seconds = Number(error.retryAfter)
    if (!Number.isNaN(seconds)) {
      return seconds * 1000
    }

    const date = Date.parse(error.retryAfter)
    if (!Number.isNaN(date)) {
      return Math.max(date - Date.now(), 0)
    }
  }
  return BASE_BACKOFF_MS * 2 ** (attempt - 1) + Math.random() * 500
}

async function requestWithRetry(url) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    await sleep(DELAY_MS)
    try {
      const html = await request(url)
      log({ url, status: 200, attempt })
      return html
    } 
    catch (error) {
      log({ url, status: error.status ?? error.name, attempt })
      if (!isRetryable(error) || attempt === MAX_ATTEMPTS) {
        throw error
      }
      await sleep(waitTime(error, attempt))
    }
  }
}

export async function getPage(url, cacheName) {
  const file = `cache/${cacheName}`
  if (existsSync(file)) {
    const html = await readFile(file, 'utf-8')
    const { mtime } = await stat(file)
    stats.cacheHits += 1
    console.log(`CACHE HIT ${url} ${Buffer.byteLength(html)} bytes`)
    return { html, fetchedAt: mtime.toISOString() }
  }

  const html = await requestWithRetry(url)
  await mkdir('cache', { recursive: true })
  await writeFile(file, html)
  stats.fetched += 1
  console.log(`FETCH ${url} ${Buffer.byteLength(html)} bytes`)
  return { html, fetchedAt: new Date().toISOString() }
}