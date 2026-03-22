import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, AlertTriangle, CheckCircle, Calendar, Search } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/formatters'
import { MOCK_VEHICLES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const now     = Date.now()
const soon14  = now + 14 * 86_400_000

const dueSoon     = MOCK_VEHICLES.filter(v => v.next_maintenance_date && new Date(v.next_maintenance_date).getTime() <= soon14).length
const inShop      = MOCK_VEHICLES.filter(v => v.status === 'in_maintenance').length
const completedMo = 3

export default function MaintenancePage() {
  const navigate  = useNavigate()
  const [search, setSearch] = useState('')

  const sorted = MOCK_VEHICLES
    .filter(v => v.next_maintenance_date)
    .filter(v => {
      const q = search.toLowerCase()
      return !search ||
        v.unit_number.toLowerCase().includes(q) ||
        (v.make ?? '').toLowerCase().includes(q) ||
        (v.model ?? '').toLowerCase().includes(q)
    })
    .sort((a, b) => new Date(a.next_maintenance_date!).getTime() - new Date(b.next_maintenance_date!).getTime())

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip — single card, uniform */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Due Within 14 Days',   value: dueSoon,              sub: 'Need attention',   alert: dueSoon > 0 },
          { label: 'Currently In Shop',    value: inShop,               sub: 'In maintenance',   alert: false },
          { label: 'Completed This Month', value: completedMo,          sub: 'March 2024',       alert: false },
          { label: 'Total Vehicles',       value: MOCK_VEHICLES.length, sub: 'Fleet size',       alert: false },
        ].map(({ label, value, sub, alert }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-2">{label}</p>
            <p className={cn('text-2xl font-bold tabular-nums', alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            <p className={cn('text-xs mt-1.5', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search by unit, make, model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-72"
          />
        </div>
        <button
          className="ml-auto flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        >
          <Calendar className="h-3.5 w-3.5" />
          Schedule PM
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Maintenance Schedule</p>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{sorted.length} vehicles</span>
        </div>

        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Unit', 'Vehicle', 'Status', 'Next PM', 'Days Out', 'Mileage', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {sorted.map((v, i) => {
              const daysUntil = Math.ceil((new Date(v.next_maintenance_date!).getTime() - now) / 86_400_000)
              const overdue   = daysUntil < 0
              const urgent    = !overdue && daysUntil <= 14

              return (
                <motion.tr
                  key={v.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                  onClick={() => navigate(`/dashboard/fleet/${v.id}`)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-zinc-50">{v.unit_number}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 dark:text-zinc-300">{v.year} {v.make} {v.model}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">{v.license_plate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={v.status} type="vehicle" />
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm tabular-nums font-medium',
                      overdue ? 'text-red-500' : urgent ? 'text-amber-600' : 'text-gray-800 dark:text-zinc-100'
                    )}>
                      {formatDate(v.next_maintenance_date)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {overdue ? (
                      <span className="text-xs font-medium text-red-500">Overdue</span>
                    ) : urgent ? (
                      <span className="text-xs font-medium text-amber-600">{daysUntil}d</span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{daysUntil}d</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">
                    {v.current_mileage?.toLocaleString() ?? '—'} mi
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={e => e.stopPropagation()}
                      className="h-7 px-3 rounded-md border border-gray-200 dark:border-zinc-700 text-xs text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      Schedule
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table></div>
      </motion.div>
    </div>
  )
}
