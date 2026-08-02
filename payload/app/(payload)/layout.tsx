import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import type { ReactNode } from 'react'
import type { ServerFunctionClient } from 'payload'
import '@payloadcms/next/css'
// @ts-expect-error Payload generates this import map as JavaScript.
import { importMap } from './admin/importMap.js'

export { metadata } from '@payloadcms/next/layouts'

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return RootLayout({ children, config, importMap, serverFunction })
}
