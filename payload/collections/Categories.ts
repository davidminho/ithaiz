import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  defaultSort: 'sort',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'sort', type: 'number', defaultValue: 0 },
    { name: 'notes', type: 'textarea' },
  ],
}
