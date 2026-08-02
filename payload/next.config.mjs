import { withPayload } from '@payloadcms/next/withPayload'
import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias['@payload-config'] = path.resolve(process.cwd(), 'payload.config.ts')
    return config
  },
}

export default withPayload(nextConfig)
