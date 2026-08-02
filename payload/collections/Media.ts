import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: { mimeTypes: ['image/*'], adminThumbnail: 'thumbnail' },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
