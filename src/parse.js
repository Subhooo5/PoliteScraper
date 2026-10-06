import * as cheerio from 'cheerio'

export function extractBookLinks(html, pageUrl) {
    const $ = cheerio.load(html)
    return $('article.product_pod h3 a')
        .map((_, e1) => new URL($(e1).attr('href'), pageUrl).href)
        .get()
}

export function extractNextPage(html, pageUrl) {
    const $ = cheerio.load(html)
    const href = $('li.next a').attr('href')
    return href ? new URL(href, pageUrl).href : null
}

const clean = (text) => text.replace(/\s+/g, ' ').trim()

export function extractRawBook(html, productUrl, sourcePage, fetchedAt) {
  const $ = cheerio.load(html)
  const product = $('article.product_page')
  const main = product.find('.product_main')
  const description = product.find('#product_description + p').text()
  const ratingClass = main.find('p.star-rating').attr('class')
  
  return {
    title: clean(main.find('h1').text()),
    product_url: productUrl,
    price_text: clean(main.find('.price_color').text()),
    availability_text: clean(main.find('.availability').text()),
    rating_text: ratingClass ? ratingClass.replace('star-rating', '').trim() : null,
    description: description ? clean(description) : null,
    source_page: sourcePage,
    fetched_at: fetchedAt
  }
}