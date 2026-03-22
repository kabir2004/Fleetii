import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="mb-4 h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
