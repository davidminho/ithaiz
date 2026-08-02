import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const sourcePath = process.env.MENU_SOURCE || path.resolve(here, '../../backend/data/menu_extracted.json')
const email = process.env.PAYLOAD_EMAIL
const password = process.env.PAYLOAD_PASSWORD

if (!email || !password) throw new Error('Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD before importing.')

const source = JSON.parse(await readFile(sourcePath, 'utf8'))
const request = async (pathname, options = {}) => {
  const response = await fetch(`${baseURL}${pathname}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${response.status} ${pathname}: ${JSON.stringify(body)}`)
  return body
}

const auth = await request('/api/users/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
})
const headers = { Authorization: `JWT ${auth.token}` }
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const categories = new Map()
for (const [categoryIndex, category] of source.categories.entries()) {
  const created = await request('/api/categories', {
    method: 'POST', headers,
    body: JSON.stringify({ name: category.category_name, slug: slugify(category.category_name), sort: categoryIndex, notes: '' }),
  })
  categories.set(category.category_id, created.doc.id)
  for (const [itemIndex, item] of category.items.entries()) {
    await request('/api/menu-items', {
      method: 'POST', headers,
      body: JSON.stringify({
        name: item.name, description: item.description, category: created.doc.id,
        price: item.price_text, priceValue: item.price_value, currency: item.currency || 'USD',
        variants: item.variants || [], options: item.options || [], sourceFile: item.source_file,
        sourcePage: item.source_page, sort: itemIndex, _status: 'draft',
      }),
    })
  }
}

console.log(`Imported ${source.categories.length} categories and ${source.categories.reduce((n, c) => n + c.items.length, 0)} menu items as draft.`)
