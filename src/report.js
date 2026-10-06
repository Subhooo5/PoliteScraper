import { mkdir, writeFile } from 'node:fs/promises'

export async function writeReport(startedAt, stats, validCount, invalidCount, extra = {}) {
  const report = {
    started_at: startedAt.toISOString(),
    duration_seconds: Number(((Date.now() - startedAt.getTime()) / 1000).toFixed(2)),
    pages_fetched: stats.fetched,
    cache_hits: stats.cacheHits,
    valid_records: validCount,
    invalid_records: invalidCount,
    failed_pages: stats.failedPages,
    ...extra
  }
  
  await mkdir('output', { recursive: true })
  await writeFile('output/run-report.json', JSON.stringify(report, null, 2))
  return report
}