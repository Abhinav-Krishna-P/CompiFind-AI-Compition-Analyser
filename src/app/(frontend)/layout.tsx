import type { Metadata } from 'next'
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import '@/app/globals.css'

/**
 * Space Grotesk — display/heading font.
 * Geometric, mechanically precise. Used for headings, page titles, sidebar logo.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

/**
 * IBM Plex Sans — UI / body font.
 * Technical, neutral, excellent legibility at small sizes for dense data tables.
 */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
})

/**
 * IBM Plex Mono — monospace font.
 * Same IBM Plex family. Used for cron expressions, API keys, scrape IDs,
 * timestamps, and any raw data values.
 */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Rivalyze',
    template: '%s · Rivalyze',
  },
  description: 'Competitor intelligence — automated and precise.',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
