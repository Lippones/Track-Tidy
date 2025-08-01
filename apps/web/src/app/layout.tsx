import { Geist, Geist_Mono } from 'next/font/google'

import '@workspace/ui/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: {
    default: 'Track Tidy',
    template: '%s | Track Tidy'
  },
  description:
    'Deixe a IA Organizar Suas Playlists do Spotify. Selecione suas playlists ou suas músicas curtidas, escreva como deseja o mix e receba listas inteligentes criadas em segundos.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
