import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface InviteRow { email: string; role: string }

export default function OnboardingTeam() {
  const navigate = useNavigate()
  const { nextStep, prevStep } = useOnboardingStore()
  const [invites, setInvites] = useState<InviteRow[]>([{ email: '', role: 'dispatcher' }])

  const addRow = () => setInvites(prev => [...prev, { email: '', role: 'dispatcher' }])
  const removeRow = (i: number) => setInvites(prev => prev.filter((_, idx) => idx !== i))
  const updateRow = (i: number, field: keyof InviteRow, val: string) =>
    setInvites(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row))

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Invite your team</h1>
      <p className="text-zinc-400 mb-8">Add team members to collaborate in Fleetii</p>

      <div className="space-y-3 mb-6">
        {invites.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              placeholder="colleague@company.com"
              type="email"
              value={row.email}
              onChange={e => updateRow(i, 'email', e.target.value)}
              className="flex-1"
            />
            <Select value={row.role} onValueChange={val => updateRow(i, 'role', val)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="dispatcher">Dispatcher</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
              </SelectContent>
            </Select>
            {invites.length > 1 && (
              <button onClick={() => removeRow(i)} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 mb-8"
      >
        <Plus className="h-4 w-4" />
        Add another
      </button>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => { prevStep(); navigate('/onboarding/integrations') }} className="flex-1">Back</Button>
        <Button onClick={() => { nextStep(); navigate('/onboarding/complete') }} className="flex-1">
          {invites.some(r => r.email) ? `Send ${invites.filter(r => r.email).length} invite(s)` : 'Skip for now'}
        </Button>
      </div>
    </div>
  )
}
