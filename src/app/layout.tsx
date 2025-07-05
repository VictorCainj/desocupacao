import { ErrorBoundary } from '@/components/common/error-boundary'
import { ConditionalNavigation } from '@/components/layout/conditional-navigation'
import { PerformanceMonitor } from '@/hooks/use-performance'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Modern App - 21st.dev Compatible',
  description: 'Aplicação moderna compatível com 21st.dev e Context7 MCP',
  metadataBase: new URL('https://localhost:3000'),
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={cn('h-full', inter.variable)}>
      <body className={cn(inter.className, 'h-full antialiased font-sans')}>
        <ErrorBoundary>
          <PerformanceMonitor>
            <div className="relative flex min-h-full flex-col">
              <ConditionalNavigation />
              <main className="flex-1">{children}</main>
            </div>
          </PerformanceMonitor>
        </ErrorBoundary>
      </body>
    </html>
  )
}
