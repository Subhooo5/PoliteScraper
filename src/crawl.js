import { getPage, stats } from './http.js'
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
    let page

    try {
      page = await getPage(pageUrl, `catalogue-page-${pages}.html`)
    } 
    catch (error) {
      console.log(`FAILED ${pageUrl} ${error.message}`)
      stats.failedPages += 1
      break
    }

    for (const link of extractBookLinks(page.html, pageUrl)) {
      discovered += 1
      if (!found.has(link)) {
        found.set(link, pageUrl)
      }
    }

    pageUrl = extractNextPage(page.html, pageUrl)
  }
  
  const books = [...found].map(([url, sourcePage]) => ({ url, sourcePage }))
  return { pages, discovered, books }
}