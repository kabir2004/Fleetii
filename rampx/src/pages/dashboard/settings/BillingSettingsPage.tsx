import { CheckCircle, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle className="text-base">Current Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-1">Pro Plan</div>
              <div className="font-numeric text-gray-500 dark:text-zinc-400 mb-3">$799/month · Renews April 1, 2024</div>
              <div className="space-y-1.5">
                {['Up to 50 trucks', 'Unlimited freight audit', 'Carrier payments & AP', '10 team members'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                    <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm">Upgrade to Enterprise</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Payment Method</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 mb-4">
            <CreditCard className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-700 dark:text-zinc-200">Visa ending in 4242</div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Expires 12/2026</div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
