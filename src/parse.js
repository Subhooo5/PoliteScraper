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