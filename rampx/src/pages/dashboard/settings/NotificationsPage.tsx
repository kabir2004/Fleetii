import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const NOTIFICATION_SETTINGS = [
  { group: 'Finance', items: [
    { key: 'invoice_overdue', label: 'Invoice overdue', email: true, inapp: true },
    { key: 'invoice_disputed', label: 'Invoice discrepancy found', email: true, inapp: true },
    { key: 'payment_completed', label: 'Payment completed', email: false, inapp: true },
  ]},
  { group: 'Operations', items: [
    { key: 'load_delivered', label: 'Load delivered', email: false, inapp: true },
    { key: 'driver_hos', label: 'Driver HOS violation', email: true, inapp: true },
    { key: 'fuel_flagged', label: 'Fuel transaction flagged', email: true, inapp: true },
  ]},
  { group: 'Compliance', items: [
    { key: 'doc_expiring', label: 'Document expiring (30 days)', email: true, inapp: true },
    { key: 'maintenance_due', label: 'Maintenance due', email: false, inapp: true },
  ]},
]

export default function NotificationsPage() {
  const [settings, setSettings] = useState(
    Object.fromEntries(
      NOTIFICATION_SETTINGS.flatMap(g => g.items.flatMap(i => [
        [`${i.key}_email`, i.email],
        [`${i.key}_inapp`, i.inapp],
      ]))
    )
  )

  const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="max-w-2xl space-y-8">
      {NOTIFICATION_SETTINGS.map(group => (
        <div key={group.group}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-4">{group.group}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="text-xs text-gray-400 dark:text-zinc-600">Notification</div>
              <div className="text-xs text-gray-400 dark:text-zinc-600 text-center">Email</div>
              <div className="text-xs text-gray-400 dark:text-zinc-600 text-center">In-App</div>
            </div>
            {group.items.map(item => (
              <div key={item.key} className="grid grid-cols-3 gap-4 items-center p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <Label className="text-sm text-gray-600 dark:text-zinc-300">{item.label}</Label>
                <div className="flex justify-center">
                  <Switch checked={!!settings[`${item.key}_email`]} onCheckedChange={() => toggle(`${item.key}_email`)} />
                </div>
                <div className="flex justify-center">
                  <Switch checked={!!settings[`${item.key}_inapp`]} onCheckedChange={() => toggle(`${item.key}_inapp`)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
