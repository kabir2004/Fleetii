import { useNavigate } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { Button } from '@/components/ui/button'

export default function OnboardingFleet() {
  const navigate = useNavigate()
  const { fleetSize, setFleetSize, nextStep, prevStep } = useOnboardingStore()

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Your fleet</h1>
      <p className="text-zinc-400 mb-8">How many trucks do you operate?</p>

      <div className="flex items-center justify-center gap-6 mb-10 py-8 rounded-xl border border-zinc-800 bg-zinc-900">
        <button
          onClick={() => setFleetSize(Math.max(1, fleetSize - 1))}
          className="h-10 w-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-numeric text-5xl font-bold text-zinc-50 w-24 text-center">{fleetSize}</span>
        <button
          onClick={() => setFleetSize(fleetSize + 1)}
          className="h-10 w-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => { prevStep(); navigate('/onboarding/company') }} className="flex-1">Back</Button>
        <Button onClick={() => { nextStep(); navigate('/onboarding/integrations') }} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
