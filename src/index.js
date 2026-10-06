import { discoverBooks } from './crawl.js'
import { scrapeBooks } from './scrape.js'
import { validateAndStore } from './store.js'
import { writeReport } from './report.js'
import { stats } from './http.js'
import { writeCsv } from './csv.js'

const startedAt = new Date()
const withFake = process.argv.includes('--with-fake')

const { pages, discovered, books } = await discoverBooks()
console.log(`catalogue_pages=${pages} discovered=${discovered} unique_urls=${books.length}`)

if (withFake) {
  books.push({
    url: 'https://books.toscrape.com/catalogue/not-a-real-book_999/index.html',
    sourcePage: 'https://books.toscrape.com/catalogue/page-1.html'
  })
}

const rawRecords = await scrapeBooks(books)
console.log(`detail_pages=${rawRecords.length}`)

const { valid, errors } = await validateAndStore(rawRecords)
await writeCsv(valid)
const report = await writeReport(startedAt, stats, valid.length, errors.length)
console.log(report)