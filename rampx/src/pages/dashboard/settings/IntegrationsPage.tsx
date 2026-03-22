import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

const INTEGRATIONS = [
  { name: 'Samsara', desc: 'ELD & GPS tracking', category: 'ELD', connected: true },
  { name: 'QuickBooks Online', desc: 'Accounting & payroll', category: 'Accounting', connected: true },
  { name: 'Comdata', desc: 'Fuel card transactions', category: 'Fuel Cards', connected: false },
  { name: 'KeepTruckin (Motive)', desc: 'ELD compliance', category: 'ELD', connected: false },
  { name: 'WEX', desc: 'Fleet fuel cards', category: 'Fuel Cards', connected: false },
  { name: 'DAT One', desc: 'Load board & rates', category: 'Load Board', connected: true },
]

export default function IntegrationsPage() {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.name, i.connected]))
  )

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-200 mb-4">Connected Integrations</h2>
      {INTEGRATIONS.map(int => (
        <div key={int.name} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex-1">
            <div className="font-medium text-gray-700 dark:text-zinc-200">{int.name}</div>
            <div className="text-xs text-gray-400 dark:text-zinc-500">{int.desc} · <span className="text-gray-300 dark:text-zinc-600">{int.category}</span></div>
          </div>
          <div className="flex items-center gap-3">
            {states[int.name] && <span className="text-xs text-green-400">Connected</span>}
            <Switch
              checked={states[int.name]}
              onCheckedChange={v => setStates(prev => ({ ...prev, [int.name]: v }))}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
