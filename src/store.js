import { mkdir, writeFile } from 'node:fs/promises'
import { normalizeBook } from './normalize.js'
import { bookSchema } from './schema.js'

export async function validateAndStore(rawRecords) {
  const unique = new Map()
  const errors = []

  for (const raw of rawRecords) {
    const result = bookSchema.safeParse(normalizeBook(raw))
    if (result.success) {
      unique.set(result.data.product_url, result.data)
    } else {
      errors.push({
        product_url: raw.product_url,
        reasons: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      })
    }
  }
  
  const valid = [...unique.values()]
  await mkdir('output', { recursive: true })
  await writeFile('output/books.json', JSON.stringify(valid, null, 2))
  await writeFile('output/errors.json', JSON.stringify(errors, null, 2))
  return { valid, errors }
}