import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="font-numeric text-8xl font-bold text-zinc-800 mb-4">404</div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">Page not found</h1>
        <p className="text-zinc-500 mb-8">The page you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </motion.div>
    </div>
  )
}
