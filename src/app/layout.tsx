import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MangaCompass - Discover Your Next Favorite Manga',
  description: 'Get personalized manga recommendations based on your reading history. Find hidden gems and popular series tailored to your taste.',
  keywords: 'manga, recommendations, anime, japanese comics, personalized',
  authors: [{ name: 'MangaCompass Team' }],
  openGraph: {
    title: 'MangaCompass - Discover Your Next Favorite Manga',
    description: 'Get personalized manga recommendations based on your reading history.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}