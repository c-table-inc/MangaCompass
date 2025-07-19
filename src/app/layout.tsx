import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MangaCompass - Discover Your Next Favorite Manga',
  description: 'Get personalized manga recommendations based on your reading history. Find hidden gems and popular series tailored to your taste with our AI-powered recommendation engine.',
  keywords: ['manga', 'recommendations', 'anime', 'japanese comics', 'personalized', 'reading history', 'AI', 'discovery', 'otaku', 'webtoon'],
  authors: [{ name: 'MangaCompass Team' }],
  creator: 'MangaCompass',
  publisher: 'MangaCompass',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mangacompass.vercel.app'),
  openGraph: {
    title: 'MangaCompass - Discover Your Next Favorite Manga',
    description: 'Get personalized manga recommendations based on your reading history. Find hidden gems and popular series tailored to your taste.',
    type: 'website',
    url: 'https://mangacompass.vercel.app',
    siteName: 'MangaCompass',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MangaCompass - Personalized Manga Recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MangaCompass - Discover Your Next Favorite Manga',
    description: 'Get personalized manga recommendations based on your reading history.',
    images: ['/og-image.png'],
    creator: '@mangacompass',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://mangacompass.vercel.app" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}