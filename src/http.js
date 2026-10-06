import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const USER_AGENT = 'FlyRankInternshipA9/1.0 (+https://github.com/Subhooo5/PoliteScraper)'
const TIMEOUT_MS = 8000
const DELAY_MS = 600
const RETRY_WAIT_MS = 2000

export const stats = { fetched: 0, cacheHits: 0, failedPages: 0 }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })

  if (response.status !== 200) {
    const error = new Error(`Request failed with status ${response.status} for ${url}`)
    error.status = response.status
    throw error
  }

  return response.text()
}

function isRetryable(error) {
  return error.status >= 500 || error.name === 'TimeoutError'
}

async function requestWithRetry(url) {
  await sleep(DELAY_MS)

  try {
    return await request(url)
  } catch (error) {
    if (!isRetryable(error)) {
      throw error
    }
    console.log(`RETRY ${url} after ${error.message}`)
    await sleep(RETRY_WAIT_MS)
    return request(url)
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