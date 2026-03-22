import { motion } from 'framer-motion'
import { AlertTriangle, Fuel, Droplets, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { MOCK_FUEL_TRANSACTIONS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const DRIVER_MAP: Record<string, string> = {
  'driver-1': 'M. Williams',
  'driver-2': 'S. Chen',
  'driver-3': 'D. Johnson',
  'driver-5': 'J. Okafor',
}
const VEHICLE_MAP: Record<string, string> = {
  'vehicle-1': 'T-101',
  'vehicle-2': 'T-102',
  'vehicle-5': 'T-105',
  'vehicle-6': 'T-106',
}

export default function FuelCardsPage() {
  const total       = MOCK_FUEL_TRANSACTIONS.reduce((s, t) => s + t.total_amount, 0)
  const totalGal    = MOCK_FUEL_TRANSACTIONS.reduce((s, t) => s + (t.gallons ?? 0), 0)
  const avgPpg      = total / totalGal
  const flagged     = MOCK_FUEL_TRANSACTIONS.filter(t => t.flagged)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Fuel Spend (MTD)',       value: formatCurrency(total),        sub: `${MOCK_FUEL_TRANSACTIONS.length} transactions`,   icon: DollarSign,  alert: false },
          { label: 'Total Gallons',          value: `${totalGal.toFixed(0)} gal`, sub: 'Diesel · March 2024',                            icon: Droplets,    alert: false },
          { label: 'Avg Price / Gallon',     value: `$${avgPpg.toFixed(3)}`,      sub: 'Fleet average',                                  icon: TrendingUp,  alert: false },
          { label: 'Flagged Transactions',   value: String(flagged.length),        sub: flagged.length > 0 ? 'Needs review' : 'All clear', icon: AlertTriangle, alert: flagged.length > 0 },
        ].map(({ label, value, sub, icon: Icon, alert }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className={cn('text-2xl sm:text-3xl font-bold tabular-nums tracking-tight', alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            <p className={cn('text-xs mt-1.5', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Flagged alert */}
      {flagged.length > 0 && (
        <motion.div
          className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-800">{flagged.length} suspicious transaction{flagged.length > 1 ? 's' : ''} detected</p>
          </div>
          <div className="space-y-2">
            {flagged.map(t => (
              <div key={t.id} className="flex items-start justify-between text-sm">
                <div>
                  <span className="font-medium text-amber-800">{t.merchant_name}</span>
                  <span className="text-amber-600"> · {t.location?.city}, {t.location?.state}</span>
                  <span className="text-amber-600"> · {DRIVER_MAP[t.driver_id ?? ''] ?? 'Unknown'}</span>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="font-semibold text-amber-800 tabular-nums">{formatCurrency(t.total_amount)}</span>
                  <p className="text-xs text-amber-600">{t.flag_reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transaction table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Fuel Transactions</p>
          </div>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{MOCK_FUEL_TRANSACTIONS.length} records · March 2024</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Driver', 'Unit', 'Merchant', 'Location', 'Date', 'Gallons', '$/Gal', 'Total', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {MOCK_FUEL_TRANSACTIONS.map((t, i) => (
              <motion.tr
                key={t.id}
                className={cn('hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors', t.flagged && 'bg-amber-50/50')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-zinc-100">{DRIVER_MAP[t.driver_id ?? ''] ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">{VEHICLE_MAP[t.vehicle_id ?? ''] ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300">{t.merchant_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">{t.location?.city}, {t.location?.state}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{formatDate(t.transaction_date)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">{t.gallons?.toFixed(1)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">${t.price_per_gallon?.toFixed(3)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(t.total_amount)}</td>
                <td className="px-6 py-4">
                  {t.flagged && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="h-3 w-3" />
                      Flagged
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <td colSpan={6} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Total</td>
              <td className="px-6 py-3 text-xs text-gray-500 dark:text-zinc-400 tabular-nums">${avgPpg.toFixed(3)} avg</td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(total)}</td>
              <td />
            </tr>
          </tfoot>
        </table></div>
      </motion.div>
    </div>
  )
}
