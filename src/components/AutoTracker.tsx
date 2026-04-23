'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { captureUTMs } from '@/lib/utm'
import { track } from '@/lib/tracker'

/**
 * AutoTracker — Silent client component that handles:
 * 1. UTM capture on mount
 * 2. page_view on every route change
 * 3. scroll_depth tracking (25%, 50%, 75%, 100%)
 * 4. time_on_site on page unload (sendBeacon)
 *
 * Renders nothing — zero visual footprint
 */
export default function AutoTracker() {
  const pathname = usePathname()
  const mountTime = useRef(Date.now())
  const scrollMilestones = useRef(new Set<number>())

  // 1. Capture UTMs on first mount
  useEffect(() => {
    captureUTMs()
  }, [])

  // 2. Track page_view on every route change
  useEffect(() => {
    // Small delay to ensure the page is fully rendered
    const timer = setTimeout(() => {
      track('page_view', {
        metadata: { path: pathname },
      })
    }, 100)

    // Reset scroll milestones on navigation
    scrollMilestones.current.clear()
    mountTime.current = Date.now()

    return () => clearTimeout(timer)
  }, [pathname])

  // 3. Scroll depth tracking
  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    if (scrollHeight <= 0) return

    const pct = Math.round((window.scrollY / scrollHeight) * 100)
    const milestones = [25, 50, 75, 100]

    for (const milestone of milestones) {
      if (pct >= milestone && !scrollMilestones.current.has(milestone)) {
        scrollMilestones.current.add(milestone)
        track('scroll_depth', {
          metadata: { depth: milestone, path: pathname },
        })
      }
    }
  }, [pathname])

  useEffect(() => {
    // Throttled scroll handler
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [handleScroll])

  // 4. time_on_site on page unload (uses sendBeacon)
  useEffect(() => {
    const onUnload = () => {
      const seconds = Math.round((Date.now() - mountTime.current) / 1000)
      track('time_on_site', {
        beacon: true,
        metadata: { seconds, path: pathname },
      })
    }

    window.addEventListener('beforeunload', onUnload)
    // Also track on visibility change (mobile tabs)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onUnload()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', onUnload)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [pathname])

  return null
}
