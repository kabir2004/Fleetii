import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, GitMerge, Package, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { cn } from '@/lib/utils'
import type { CompanyType } from '@/types/common.types'

const OPTIONS: { type: CompanyType; label: string; description: string; icon: React.ElementType }[] = [
  { type: 'carrier', label: 'Carrier', description: 'I own/operate trucks and move freight', icon: Truck },
  { type: 'broker', label: 'Broker', description: 'I arrange freight transportation for shippers', icon: GitMerge },
  { type: '3pl', label: '3PL', description: 'I provide third-party logistics services', icon: Package },
  { type: 'shipper', label: 'Shipper', description: 'I ship goods and need carriers', icon: Store },
]

export default function OnboardingWelcome() {
  const navigate = useNavigate()
  const { companyType, setCompanyType, nextStep } = useOnboardingStore()

  const handleContinue = () => {
    if (!companyType) return
    nextStep()
    navigate('/onboarding/company')
  }

  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">Welcome to Fleetii</h1>
        <p className="text-zinc-400 mb-10">What type of company are you?</p>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-8">
          {OPTIONS.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setCompanyType(type)}
              className={cn(
                'p-6 rounded-xl border text-left transition-all',
                companyType === type
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              )}
            >
              <Icon className={cn('h-8 w-8 mb-3', companyType === type ? 'text-green-400' : 'text-zinc-500')} />
              <div className="font-semibold text-zinc-100 mb-1">{label}</div>
              <div className="text-sm text-zinc-500">{description}</div>
            </button>
          ))}
        </div>

        <Button onClick={handleContinue} disabled={!companyType} size="lg" className="w-full max-w-sm">
          Continue
        </Button>
      </motion.div>
    </div>
  )
}
