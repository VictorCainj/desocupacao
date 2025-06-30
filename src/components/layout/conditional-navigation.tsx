'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './navigation'

export function ConditionalNavigation() {
  const pathname = usePathname()

  // Ocultar navegação nas páginas que têm sidebar
  const hiddenRoutes = ['/inicio']

  if (hiddenRoutes.includes(pathname)) {
    return null
  }

  return <Navigation />
}
