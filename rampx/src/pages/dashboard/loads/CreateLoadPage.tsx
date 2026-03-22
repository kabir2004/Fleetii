import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const STEPS = ['Route', 'Cargo', 'Schedule', 'Pricing', 'Assignment', 'Review']

export default function CreateLoadPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/dashboard/loads')} className="text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Create New Load</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
              i < step ? 'bg-green-500 text-zinc-950' :
              i === step ? 'bg-green-500/20 text-green-400 border border-green-500' :
              'bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 border border-gray-300 dark:border-zinc-700'
            )}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn(
              'ml-2 text-xs font-medium mr-3',
              i === step ? 'text-gray-700 dark:text-zinc-200' : i < step ? 'text-green-400' : 'text-gray-300 dark:text-zinc-600'
            )}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-px mx-1', i < step ? 'bg-green-500/50' : 'bg-gray-200 dark:bg-zinc-800')} />
            )}
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Shipper (Origin)</h3>
                  <div className="space-y-1.5">
                    <Label>Company Name</Label>
                    <Input placeholder="Midwest Steel Supply Co." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Address</Label>
                    <Input placeholder="5200 W 47th St" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5 col-span-2">
                      <Label>City</Label>
                      <Input placeholder="Chicago" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>State</Label>
                      <Input placeholder="IL" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Consignee (Destination)</h3>
                  <div className="space-y-1.5">
                    <Label>Company Name</Label>
                    <Input placeholder="Texas Metal Works" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Address</Label>
                    <Input placeholder="3800 Plano Rd" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5 col-span-2">
                      <Label>City</Label>
                      <Input placeholder="Dallas" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>State</Label>
                      <Input placeholder="TX" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Commodity</Label>
                  <Input placeholder="Steel coils" />
                </div>
                <div className="space-y-1.5">
                  <Label>Equipment Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
                    <SelectContent>
                      {['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Tanker', 'Box Truck'].map(t => (
                        <SelectItem key={t} value={t.toLowerCase().replace(' ', '_')}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Weight (lbs)</Label>
                  <Input type="number" placeholder="44000" />
                </div>
                <div className="space-y-1.5">
                  <Label>Pieces</Label>
                  <Input type="number" placeholder="8" />
                </div>
                <div className="space-y-1.5">
                  <Label>Estimated Miles</Label>
                  <Input type="number" placeholder="924" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Pickup Date & Time</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-1.5">
                  <Label>Delivery Date & Time</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-1.5">
                  <Label>Special Instructions</Label>
                  <Input placeholder="Call 30 mins before arrival" />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Customer Rate ($)</Label>
                  <Input type="number" placeholder="4800" />
                </div>
                <div className="space-y-1.5">
                  <Label>Driver Pay ($)</Label>
                  <Input type="number" placeholder="2784" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fuel Surcharge ($)</Label>
                  <Input type="number" placeholder="420" />
                </div>
                <div className="space-y-1.5">
                  <Label>Accessorial Charges ($)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Assign Driver</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                    <SelectContent>
                      {['Marcus Williams', 'Sandra Chen', 'Derek Johnson', 'Elena Rodriguez', 'James Okafor'].map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assign Tractor</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>
                      {['T-101 (Freightliner Cascadia)', 'T-102 (Kenworth T680)', 'T-104 (Volvo VNL 860)', 'T-105', 'T-106'].map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-zinc-300">Review all load details before creating. All fields can be edited after creation.</p>
                <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-4 space-y-2 text-sm">
                  {[
                    ['Route', 'Chicago, IL → Dallas, TX'],
                    ['Commodity', 'Steel coils'],
                    ['Equipment', 'Flatbed'],
                    ['Customer Rate', '$4,800.00'],
                    ['Driver', 'Marcus Williams'],
                    ['Tractor', 'T-101'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400 dark:text-zinc-500">{k}</span>
                      <span className="text-gray-700 dark:text-zinc-200">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => step === 0 ? navigate('/dashboard/loads') : setStep(s => s - 1)}
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={() => step === STEPS.length - 1 ? navigate('/dashboard/loads') : setStep(s => s + 1)}
          className="gap-2"
        >
          {step === STEPS.length - 1 ? 'Create Load' : 'Continue'}
          {step < STEPS.length - 1 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
