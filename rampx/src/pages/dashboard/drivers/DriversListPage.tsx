import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { MOCK_DRIVERS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'on_load',   label: 'On Load' },
  { key: 'off_duty',  label: 'Off Duty' },
]

const onLoad    = MOCK_DRIVERS.filter(d => d.status === 'on_load').length
const available = MOCK_DRIVERS.filter(d => d.status === 'available').length
const avgSafety = (MOCK_DRIVERS.reduce((s, d) => s + (d.safety_score ?? 0), 0) / MOCK_DRIVERS.length).toFixed(1)

const KPI_STRIP = [
  { label: 'Total Drivers', value: String(MOCK_DRIVERS.length), sub: '' },
  { label: 'On Load',       value: String(onLoad),              sub: '' },
  { label: 'Available',     value: String(available),           sub: '' },
  { label: 'Avg Safety',    value: `${avgSafety}/10`,           sub: '' },
]

function safetyColor(score: number) {
  if (score >= 9) return 'text-green-600'
  if (score >= 7) return 'text-amber-600'
  return 'text-red-500'
}

function cdlStatus(expiry: string | undefined) {
  if (!expiry) return null
  const days = Math.floor((new Date(expiry).getTime() - Date.now()) / 86_400_000)
  if (days < 0)  return { label: 'Expired',      cls: 'text-red-500' }
  if (days < 60) return { label: `${days}d left`, cls: 'text-amber-600' }
  return null
}

export default function DriversListPage() {
  const navigate = useNavigate()
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = MOCK_DRIVERS.filter(d => {
    const name = `${d.first_name} ${d.last_name}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || d.phone.includes(search)
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Drivers</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Manage your driving team</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/drivers/new')}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Driver
        </button>
      </div>

      {/* KPI Strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {KPI_STRIP.map(({ label, value, sub }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-xl sm:text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
            {sub && <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500">{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div className="flex flex-wrap gap-2 sm:gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search drivers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100 focus:border-transparent w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                statusFilter === f.key
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Driver', 'Status', 'CDL', 'Pay Rate', 'YTD Miles', 'YTD Earnings', 'Safety Score'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((driver, i) => {
              const cdl = cdlStatus(driver.cdl_expiry)
              const score = driver.safety_score ?? 0

              return (
                <motion.tr
                  key={driver.id}
                  className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/dashboard/drivers/${driver.id}`)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Driver */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          {driver.first_name[0]}{driver.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">{driver.first_name} {driver.last_name}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">{driver.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={driver.status} type="driver" />
                  </td>

                  {/* CDL */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-700 dark:text-zinc-300">Class {driver.cdl_class} · {driver.cdl_state}</p>
                    {cdl ? (
                      <p className={cn('text-xs mt-0.5', cdl.cls)}>Exp {formatDate(driver.cdl_expiry)} · {cdl.label}</p>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Exp {formatDate(driver.cdl_expiry)}</p>
                    )}
                  </td>

                  {/* Pay Rate */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-50 tabular-nums">${driver.pay_rate?.toFixed(2)}/mi</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 capitalize">{driver.pay_type?.replace('_', ' ')}</p>
                  </td>

                  {/* YTD Miles */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-50 tabular-nums">{driver.ytd_miles?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">miles</p>
                  </td>

                  {/* YTD Earnings */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-green-600 tabular-nums">{formatCurrency(driver.ytd_earnings)}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">year to date</p>
                  </td>

                  {/* Safety Score */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-bold tabular-nums', safetyColor(score))}>
                        {score.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-300 dark:text-zinc-600">/10</span>
                    </div>
                    <div className="mt-1.5 h-1 w-16 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', score >= 9 ? 'bg-green-500' : score >= 7 ? 'bg-amber-400' : 'bg-red-500')}
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
