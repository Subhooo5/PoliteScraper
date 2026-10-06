import { getPage } from './http.js'
import { extractBookLinks, extractNextPage } from './parse.js'

const START_URL = 'https://books.toscrape.com/catalogue/page-1.html'
const MAX_PAGES = 3

export async function discoverBooks() {
  const found = new Map()
  let discovered = 0
  let pages = 0
  let pageUrl = START_URL

  while (pageUrl && pages < MAX_PAGES) {
    pages += 1
    const { html } = await getPage(pageUrl, `catalogue-page-${pages}.html`)

    for (const link of extractBookLinks(html, pageUrl)) {
      discovered += 1
      if (!found.has(link)) {
        found.set(link, pageUrl)
      }
    }
    
    pageUrl = extractNextPage(html, pageUrl)
  }

  const books = [...found].map(([url, sourcePage]) => ({ url, sourcePage }))
  return { pages, discovered, books }
}