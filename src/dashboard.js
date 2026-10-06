import { writeFile } from 'node:fs/promises'

export async function writeDashboard(records, report) {
  const prices = records.map((record) => record.price_gbp)
  const lowest = Math.min(...prices)
  const highest = Math.max(...prices)
  const lastFresh = records.map((record) => record.fetched_at).sort().at(-1)

  const html = 
    `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>Scraper Dashboard</title>
    <style>
    body { font-family: sans-serif; max-width: 480px; margin: 40px auto; }
    td { padding: 6px 16px 6px 0; }
    </style>
    </head>
    <body>
    <h1>Scraper dashboard</h1>
    <table>
    <tr><td>Records</td><td>${records.length}</td></tr>
    <tr><td>Price range</td><td>£${lowest.toFixed(2)} to £${highest.toFixed(2)}</td></tr>
    <tr><td>Failed pages</td><td>${report.failed_pages}</td></tr>
    <tr><td>Invalid records</td><td>${report.invalid_records}</td></tr>
    <tr><td>Data last fresh</td><td>${lastFresh}</td></tr>
    </table>
    </body>
    </html>`

  await writeFile('output/dashboard.html', html)
}