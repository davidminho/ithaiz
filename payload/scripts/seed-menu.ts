import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const here = path.dirname(fileURLToPath(import.meta.url))
const sourcePath = path.resolve(here, '../../backend/data/menu_extracted.json')
const source = JSON.parse(await readFile(sourcePath, 'utf8'))
const payload = await getPayload({ config })
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

let itemCount = 0
for (const [categoryIndex, category] of source.categories.entries()) {
  const slug = slugify(category.name_original)
  const existingCategory = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  const categoryDoc = existingCategory.docs[0] ?? await payload.create({
    collection: 'categories',
    data: { name: category.name_original, slug, sort: categoryIndex, notes: '' },
  })

  for (const [itemIndex, item] of category.items.entries()) {
    const existingItem = await payload.find({
      collection: 'menu-items',
      where: { and: [{ name: { equals: item.name_original } }, { category: { equals: categoryDoc.id } }] },
      limit: 1,
    })
    if (existingItem.docs[0]) continue

    await payload.create({
      collection: 'menu-items',
      draft: true,
      data: {
        name: item.name_original,
        description: item.description_original,
        category: categoryDoc.id,
        price: item.price_text_original,
        priceValue: item.price_value,
        currency: item.currency || 'USD',
        variants: item.variants || [],
        options: item.options_original || [],
        sourceFile: item.source_file,
        sourcePage: item.page_number,
        sort: itemIndex,
      },
    })
    itemCount += 1
  }
}

console.log(`Seeded ${source.categories.length} categories and ${itemCount} new menu items as draft.`)
await payload.db.destroy()
