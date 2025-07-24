'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { GA_MEASUREMENT_ID, pageview } from '@/lib/analytics'

function GoogleAnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  // デバッグログを追加
  useEffect(() => {
    console.log('GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID)
    console.log('window.gtag:', typeof window !== 'undefined' ? window.gtag : 'undefined')
  }, [])

  if (!GA_MEASUREMENT_ID) {
    console.warn('GA_MEASUREMENT_ID is not set')
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded')
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          console.log('Google Analytics initialized with ID:', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent />
    </Suspense>
  )
}