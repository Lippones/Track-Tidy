import { Geist, Geist_Mono } from 'next/font/google'

import '@workspace/ui/globals.css'
import type { Metadata } from 'next'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Turbo Repo Next.js Example',
  description: 'A Next.js example using Turbo Repo'
}

export default function LocaleLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        {children}
      </body>
    </html>
  )
}
