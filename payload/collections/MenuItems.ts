import type { CollectionConfig } from 'payload'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'price', '_status'] },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: 'sort',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'price', type: 'text' },
    { name: 'priceValue', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'variants', type: 'json' },
    { name: 'options', type: 'json' },
    { name: 'sourceFile', type: 'text' },
    { name: 'sourcePage', type: 'number' },
    { name: 'sort', type: 'number', defaultValue: 0 },
  ],
}
