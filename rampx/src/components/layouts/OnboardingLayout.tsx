import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'

const STEPS = [
  'Welcome',
  'Company',
  'Fleet',
  'Integrations',
  'Team',
  'Complete',
]

export function OnboardingLayout() {
  const { currentStep } = useOnboardingStore()

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-zinc-50">
            Ramp<span className="text-green-400">X</span>
          </Link>
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full transition-colors ${
                  i < currentStep ? 'bg-green-500' :
                  i === currentStep ? 'bg-green-400' :
                  'bg-zinc-700'
                }`} />
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 transition-colors ${
                    i < currentStep ? 'bg-green-500' : 'bg-zinc-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-zinc-500">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
