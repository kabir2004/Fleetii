import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export default function OnboardingComplete() {
  const navigate = useNavigate()
  const { setUser, user } = useAuthStore()

  const handleLaunch = () => {
    if (user) {
      setUser({ ...user, onboarding_step: 6 })
    }
    navigate('/dashboard')
  }

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <CheckCircle className="h-10 w-10 text-green-400" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">You're all set!</h1>
        <p className="text-zinc-400 mb-8">Your Fleetii dashboard is ready. Start managing your operations.</p>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Freight Audit', desc: 'Auto-catch overcharges' },
            { label: 'Live Fleet', desc: 'Track every truck' },
            { label: 'Spend Intel', desc: 'Know where $ goes' },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900">
              <Zap className="h-5 w-5 text-green-400 mb-2 mx-auto" />
              <div className="text-sm font-semibold text-zinc-200">{item.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>

        <Button size="lg" onClick={handleLaunch} className="gap-2">
          Launch Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
