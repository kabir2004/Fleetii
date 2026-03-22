import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const INTEGRATIONS = [
  { id: 'samsara', name: 'Samsara', category: 'ELD', logo: '🚛' },
  { id: 'motive', name: 'Motive', category: 'ELD', logo: '📱' },
  { id: 'keeptruckin', name: 'KeepTruckin', category: 'ELD', logo: '📡' },
  { id: 'quickbooks', name: 'QuickBooks', category: 'Accounting', logo: '💚' },
  { id: 'xero', name: 'Xero', category: 'Accounting', logo: '💙' },
  { id: 'comdata', name: 'Comdata', category: 'Fuel Cards', logo: '⛽' },
  { id: 'efs', name: 'EFS', category: 'Fuel Cards', logo: '🏧' },
  { id: 'wex', name: 'WEX', category: 'Fuel Cards', logo: '💳' },
]

export default function OnboardingIntegrations() {
  const navigate = useNavigate()
  const { nextStep, prevStep } = useOnboardingStore()
  const [connected, setConnected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setConnected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Connect your tools</h1>
      <p className="text-zinc-400 mb-8">Link existing software to supercharge Fleetii (all optional)</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {INTEGRATIONS.map(int => (
          <button
            key={int.id}
            onClick={() => toggle(int.id)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
              connected.has(int.id)
                ? 'border-green-500 bg-green-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            )}
          >
            <span className="text-2xl">{int.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-zinc-100 text-sm">{int.name}</div>
              <div className="text-xs text-zinc-500">{int.category}</div>
            </div>
            {connected.has(int.id) && (
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-zinc-950" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => { prevStep(); navigate('/onboarding/fleet') }} className="flex-1">Back</Button>
        <Button onClick={() => { nextStep(); navigate('/onboarding/team') }} className="flex-1">
          {connected.size > 0 ? `Continue with ${connected.size} connected` : 'Skip for now'}
        </Button>
      </div>
    </div>
  )
}
