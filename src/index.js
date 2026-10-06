import { getPage } from './http.js'
import { discoverBooks } from './crawl.js'
import { scrapeBooks } from './scrape.js'
import { validateAndStore } from './store.js'

await getPage('https://books.toscrape.com/catalogue/page-1.html', 'catalogue-page-1.html')

const { pages, discovered, books } = await discoverBooks()
console.log(`catalogue_pages=${pages} discovered=${discovered} unique_urls=${books.length}`)

const rawRecords = await scrapeBooks(books)
console.log(rawRecords[0])
console.log(`detail_pages=${rawRecords.length}`)

const { valid, errors } = await validateAndStore(rawRecords)
console.log(`valid=${valid.length} invalid=${errors.length}`)