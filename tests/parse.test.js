import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { extractRawBook } from '../src/parse.js'

const load = (name) => readFileSync(`fixtures/${name}`, 'utf-8')
const productUrl = 'https://books.toscrape.com/catalogue/sample_1/index.html'
const sourcePage = 'https://books.toscrape.com/catalogue/page-1.html'
const fetchedAt = '2026-10-05T10:00:00.000Z'

test('collapses extra whitespace', () => {
  const record = extractRawBook(load('book-full.html'), productUrl, sourcePage, fetchedAt)
  assert.equal(record.title, 'A Light in the Attic')
  assert.equal(record.price_text, '£51.77')
  assert.equal(record.availability_text, 'In stock (22 available)')
  assert.equal(record.rating_text, 'Three')
  assert.equal(record.description, "It's hard to imagine a world without A Light in the Attic.")
})

test('returns null when the description is missing', () => {
  const record = extractRawBook(load('book-no-description.html'), productUrl, sourcePage, fetchedAt)
  assert.equal(record.title, 'Tipping the Velvet')
  assert.equal(record.description, null)
})