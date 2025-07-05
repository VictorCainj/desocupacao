import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      small: 'h-4 w-4',
      medium: 'h-6 w-6',
      large: 'h-8 w-8',
      xlarge: 'h-12 w-12',
    },
    variant: {
      default: 'text-primary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-green-600',
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
})

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export function LoadingSpinner({ size, variant, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(spinnerVariants({ size, variant }), className)}
      aria-label="Carregando..."
    />
  )
}

// Full page loader
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xlarge" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

// Inline loader for components
export function InlineLoader({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="small" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  )
}

// Button loader
export function ButtonLoader({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return <LoadingSpinner size={size} className="mr-2" />
}
