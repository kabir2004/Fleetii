import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function OnboardingCompany() {
  const navigate = useNavigate()
  const { companyName, dotNumber, mcNumber, setCompanyDetails, nextStep, prevStep } = useOnboardingStore()

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
    navigate('/onboarding/fleet')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Company details</h1>
      <p className="text-zinc-400 mb-8">Tell us about your business</p>

      <form onSubmit={handleContinue} className="space-y-5">
        <div className="space-y-1.5">
          <Label>Company name</Label>
          <Input
            placeholder="Northbound Freight LLC"
            value={companyName}
            onChange={e => setCompanyDetails({ companyName: e.target.value, dotNumber, mcNumber })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>DOT Number</Label>
            <Input
              placeholder="e.g. 3847291"
              value={dotNumber}
              onChange={e => setCompanyDetails({ companyName, dotNumber: e.target.value, mcNumber })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>MC Number</Label>
            <Input
              placeholder="e.g. 1029384"
              value={mcNumber}
              onChange={e => setCompanyDetails({ companyName, dotNumber, mcNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => { prevStep(); navigate('/onboarding') }} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1">Continue</Button>
        </div>
      </form>
    </div>
  )
}
