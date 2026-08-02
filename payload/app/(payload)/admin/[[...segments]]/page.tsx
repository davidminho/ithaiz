import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
// @ts-expect-error Payload generates this import map as JavaScript.
import { importMap } from '../importMap.js'

export const generateMetadata = ({ params, searchParams }: {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}) => generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
