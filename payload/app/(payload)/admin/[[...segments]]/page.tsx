import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'

export const generateMetadata = ({ params, searchParams }: {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}) => generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) =>
  RootPage({ config, importMap: {} as never, params, searchParams })

export default Page
