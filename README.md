# The Polite Scraper

Downloads the first 3 catalogue pages of Books to Scrape, visits all 60 book pages, and turns the HTML into validated JSON with a run report.

## Target classification

- **Site:** Books to Scrape (https://books.toscrape.com)
- **Why:** toscrape.com states that it is a sandbox built for people to practise scraping on.
- **How much:** the first 3 catalogue pages only (60 books).
- **Data collected:** title, product URL, price, availability, star rating and description of each book.
- **robots.txt:** requested https://books.toscrape.com/robots.txt once. Result: WRITE WHAT HAPPENED HERE.
- **Why this is appropriate:** the site exists for scraping practice, the data is practice data, and I collect only what I need at a slow, identified pace.

I will not reuse this code on another site without checking its rules and terms first.

## Setup and run

Lane: JavaScript (Node.js 20+, built-in fetch, Cheerio, Zod).

```
cd scraper
npm install
npm start
```

Outputs: `output/books.json`, `output/errors.json`, `output/run-report.json`, `output/books.csv`, `output/dashboard.html`.

Broken-page test: `npm run start:fake`. Parser tests: `npm test`.

## Record schema

| Field | Type | Notes |
|-------|------|-------|
| title | string | required |
| product_url | string | absolute https URL, record identity |
| price_text | string | original text, e.g. "£51.77" |
| price_gbp | number | clean value, positive |
| availability_text | string | required |
| rating_text | One to Five | required |
| description | string or null | null when the page has none |
| source_page | string | catalogue page the book was found on |
| fetched_at | ISO datetime | when the page was fetched |

## Politeness rules

- Honest user-agent: `FlyRankInternshipA9/1.0` with a link to this repo
- At least 600 ms between real requests
- 8 second timeout on every request
- Only status 200 is parsed
- One retry on timeout or 5xx, never on 404 or 403
- Saved copies in `cache/` so development does not hit the site again

## Sample run report

```json
PASTE YOUR REAL output/run-report.json HERE
```

## Why no browser

The data is already in the HTML the server sends, so a browser would only add cost.

## Ethics note

WRITE THIS IN YOUR OWN WORDS: use an official API when one exists, never bypass logins, paywalls or blocks, and collect only what you need.

## Limitation

WRITE ONE HONEST LIMITATION, for example: the selectors depend on the site's current HTML, so a layout change would break extraction.