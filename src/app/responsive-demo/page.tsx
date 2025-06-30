'use client'

import { ScreenSizeDemo } from '@/components/features/screen-size-demo'

export default function ResponsiveDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Sistema Responsivo</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Demonstração do hook useScreenSize para detecção de breakpoints e desenvolvimento
              responsivo
            </p>
          </div>

          <ScreenSizeDemo />
        </div>
      </div>
    </div>
  )
}
