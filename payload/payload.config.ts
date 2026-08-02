import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { MenuItems } from './collections/MenuItems'
import { Users } from './collections/Users'

export default buildConfig({
  admin: { user: Users.slug },
  collections: [Users, Categories, MenuItems, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: vercelPostgresAdapter(),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [vercelBlobStorage({ collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN })]
      : []),
  ],
  cors: [process.env.FRONTEND_URL || 'http://localhost:4173'],
  csrf: [process.env.FRONTEND_URL || 'http://localhost:4173'],
  typescript: { outputFile: './payload-types.ts' },
})
