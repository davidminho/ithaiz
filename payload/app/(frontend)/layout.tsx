import type { ReactNode } from 'react'

export const metadata = {
  title: 'iThaiz CMS',
  description: 'Content management system for iThaiz Thai Restaurant',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
