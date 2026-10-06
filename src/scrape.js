import { getPage } from './http.js'
import { extractRawBook } from './parse.js'

export async function scrapeBooks(books) {
  const records = []
  for (const book of books) {
    const slug = new URL(book.url).pathname.split('/').at(-2)
    const { html, fetchedAt } = await getPage(book.url, `book-${slug}.html`)
    records.push(extractRawBook(html, book.url, book.sourcePage, fetchedAt))
  }
  return records
}