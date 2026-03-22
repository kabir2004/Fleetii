import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-gray-100 text-gray-600',
        success: 'border-green-100 bg-green-50 text-green-700',
        warning: 'border-yellow-100 bg-yellow-50 text-yellow-700',
        danger:  'border-red-100 bg-red-50 text-red-700',
        info:    'border-blue-100 bg-blue-50 text-blue-700',
        purple:  'border-purple-100 bg-purple-50 text-purple-700',
        orange:  'border-orange-100 bg-orange-50 text-orange-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
