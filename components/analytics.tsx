'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = 'G-WXFS6QMZ0Z'

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

