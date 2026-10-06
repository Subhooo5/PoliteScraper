import { writeFile } from 'node:fs/promises'

const columns = [
  'title',
  'product_url',
  'price_text',
  'price_gbp',
  'availability_text',
  'rating_text',
  'description',
  'source_page',
  'fetched_at'
]

function toCell(value) {
  if (value === null || value === undefined) {
    return ''
  }
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export async function writeCsv(records) {
  const lines = [columns.join(',')]
  
  for (const record of records) {
    lines.push(columns.map((column) => toCell(record[column])).join(','))
  }

  await writeFile('output/books.csv', '\uFEFF' + lines.join('\n'))
}