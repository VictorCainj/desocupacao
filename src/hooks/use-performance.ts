'use client'

import '@/types/global'
import React, { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  cls?: number // Cumulative Layout Shift
  fid?: number // First Input Delay
  ttfb?: number // Time to First Byte
  renderTime?: number
  loadTime?: number
}

interface PerformanceHookReturn {
  metrics: PerformanceMetrics
  isLoading: boolean
  trackEvent: (name: string, duration: number) => void
  startTimer: (name: string) => () => void
}

export function usePerformance(): PerformanceHookReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isLoading, setIsLoading] = useState(true)
  const timersRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    let mounted = true

    const measureWebVitals = () => {
      // First Contentful Paint
      const fcpEntries = performance.getEntriesByName('first-contentful-paint')
      if (fcpEntries.length > 0) {
        const fcp = fcpEntries[0].startTime
        setMetrics((prev) => ({ ...prev, fcp }))
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            if (lastEntry && mounted) {
              setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }))
            }
          })
          observer.observe({ entryTypes: ['largest-contentful-paint'] })

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value
              }
            }
            if (mounted) {
              setMetrics((prev) => ({ ...prev, cls: clsValue }))
            }
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const firstEntry = entries[0]
            if (firstEntry && mounted) {
              setMetrics((prev) => ({
                ...prev,
                fid: (firstEntry as any).processingStart - firstEntry.startTime,
              }))
            }
          })
          fidObserver.observe({ entryTypes: ['first-input'] })

          return () => {
            observer.disconnect()
            clsObserver.disconnect()
            fidObserver.disconnect()
          }
        } catch (error) {
          console.warn('Performance Observer not supported or failed:', error)
        }
      }
    }

    const measureNavigationTiming = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          const renderTime = navigation.domContentLoadedEventEnd - navigation.fetchStart

          setMetrics((prev) => ({
            ...prev,
            ttfb,
            loadTime,
            renderTime,
          }))
        }
      }
    }

    const init = () => {
      measureWebVitals()
      measureNavigationTiming()
      setIsLoading(false)
    }

    if (document.readyState === 'complete') {
      init()
    } else {
      window.addEventListener('load', init)
    }

    return () => {
      mounted = false
    }
  }, [])

  const trackEvent = (name: string, duration: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration),
      })
    }

    // Mark custom timing
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
  }

  const startTimer = (name: string) => {
    const startTime = performance.now()
    timersRef.current.set(name, startTime)

    // Mark start time
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`)
    }

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      trackEvent(name, duration)
      timersRef.current.delete(name)
    }
  }

  return {
    metrics,
    isLoading,
    trackEvent,
    startTimer,
  }
}

// Performance monitoring component
export function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  const { metrics, startTimer } = usePerformance()

  useEffect(() => {
    const stopTimer = startTimer('component-render')
    return stopTimer
  }, [startTimer])

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.keys(metrics).length > 0) {
      console.log('Performance Metrics:', metrics)
    }
  }, [metrics])

  return children as React.ReactElement
}

// Hook for measuring component performance
export function useComponentPerformance(componentName: string) {
  const { startTimer } = usePerformance()

  useEffect(() => {
    const stopTimer = startTimer(`${componentName}-mount`)
    return stopTimer
  }, [componentName, startTimer])
}
