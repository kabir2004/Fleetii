import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_SPEND_BY_MONTH } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { Plus, Truck, Users } from 'lucide-react'

/* ── inline data ──────────────────────────────────────────────────────────── */

// Historical (actual) + 3 months projected
const FORECAST_DATA = [
  ...MOCK_SPEND_BY_MONTH.map(m => ({
    month: m.month, actual: m.revenue, projected: null, low: null, high: null, type: 'actual',
  })),
  { month: 'Apr', actual: null, projected: 1298000, low: 1218000, high: 1378000, type: 'forecast' },
  { month: 'May', actual: null, projected: 1342000, low: 1240000, high: 1444000, type: 'forecast' },
  { month: 'Jun', actual: null, projected: 1391000, low: 1260000, high: 1522000, type: 'forecast' },
]

const SCENARIOS = [
  {
    id:        'base',
    label:     'Base Case',
    icon:      Users,
    color:     'border-gray-200 dark:border-zinc-700',
    badge:     'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400',
    monthly:   1298000,
    q2Total:   4031000,
    description: 'Current trajectory — 5 drivers, 5 active trucks, existing lanes',
    changes:   ['Seasonal uptick in Midwest freight (+4%)', 'Fuel cost stabilization', 'No new lanes added'],
  },
  {
    id:        'add_driver',
    label:     '+1 Driver',
    icon:      Users,
    color:     'border-[#2D6A4F]/40 dark:border-[#C8F400]/30',
    badge:     'bg-[#2D6A4F]/10 text-[#2D6A4F] dark:bg-[#C8F400]/10 dark:text-[#C8F400]',
    monthly:   1486000,
    q2Total:   4609000,
    description: 'Add one CDL-A driver on per-mile arrangement at $0.58/mi',
    changes:   ['+$188K/mo gross revenue at 90% utilization', '+$2,320 driver pay cost/mo est.', 'Assumes existing truck capacity available'],
  },
  {
    id:        'add_truck',
    label:     '+2 Trucks',
    icon:      Truck,
    color:     'border-purple-200 dark:border-purple-900/50',
    badge:     'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
    monthly:   1612000,
    q2Total:   4997000,
    description: 'Lease 2 additional dry-van tractors — expand into 3 new lanes',
    changes:   ['+$314K/mo at 85% utilization', 'Lease cost ~$4,800/truck/mo', 'New lanes: CHI→PHX, CHI→SEA, CHI→MIA'],
  },
]

const PIPELINE = [
  { load: 'LD-20255', origin: 'Chicago, IL',  dest: 'Columbus, OH',   equip: 'Dry Van',  revenue: 7800,  status: 'Confirmed', pickup: 'Apr 2'  },
  { load: 'LD-20256', origin: 'Memphis, TN',  dest: 'Atlanta, GA',    equip: 'Reefer',   revenue: 9200,  status: 'Confirmed', pickup: 'Apr 3'  },
  { load: 'LD-20257', origin: 'Chicago, IL',  dest: 'Dallas, TX',     equip: 'Flatbed',  revenue: 11400, status: 'Confirmed', pickup: 'Apr 4'  },
  { load: 'LD-20258', origin: 'Gary, IN',     dest: 'Detroit, MI',    equip: 'Dry Van',  revenue: 4800,  status: 'Pending',   pickup: 'Apr 5'  },
  { load: 'LD-20259', origin: 'Chicago, IL',  dest: 'Kansas City',    equip: 'Dry Van',  revenue: 6200,  status: 'Pending',   pickup: 'Apr 7'  },
  { load: 'LD-20260', origin: 'Indianapolis', dest: 'Nashville, TN',  equip: 'Dry Van',  revenue: 5400,  status: 'Tentative', pickup: 'Apr 9'  },
  { load: 'LD-20261', origin: 'Chicago, IL',  dest: 'Houston, TX',    equip: 'Reefer',   revenue: 13200, status: 'Tentative', pickup: 'Apr 11' },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const items = payload.filter((p: any) => p.value !== null)
  if (!items.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {items.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Confirmed') return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900">Confirmed</span>
  )
  if (status === 'Pending') return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">Pending</span>
  )
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900">Tentative</span>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function RevenueForecastPage() {
  const { darkMode } = useUIStore()
  const green      = darkMode ? '#C8F400' : '#2D6A4F'
  const purple     = '#818cf8'
  const gridColor  = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor  = darkMode ? '#71717a' : '#9ca3af'
  const [active, setActive] = useState('base')

  const baseScenario   = SCENARIOS.find(s => s.id === 'base')!
  const activeScenario = SCENARIOS.find(s => s.id === active)!
  const pipelineTotal  = PIPELINE.reduce((s, l) => s + l.revenue, 0)
  const confirmedRev   = PIPELINE.filter(l => l.status === 'Confirmed').reduce((s, l) => s + l.revenue, 0)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Revenue Forecast</h1>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: 'base', label: 'Base Case' },
            { id: 'add_driver', label: '+1 Driver' },
            { id: 'add_truck', label: '+2 Trucks' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setActive(option.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                active === option.id
                  ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                  : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero projected figure */}
      <motion.div
        className="rounded-xl border border-[#2D6A4F]/30 dark:border-[#C8F400]/20 bg-gradient-to-br from-[#2D6A4F]/5 to-transparent dark:from-[#C8F400]/5 dark:to-transparent px-6 py-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1">April Projected Revenue (Base Case)</p>
            <p className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight text-[#2D6A4F] dark:text-[#C8F400]">
              {formatCurrency(baseScenario.monthly)}
            </p>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-2">
              Confidence range: {formatCurrency(1218000)} – {formatCurrency(1378000)} · based on 6 months trailing data
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Q2 Projected',   value: formatCurrency(baseScenario.q2Total, true) },
              { label: 'YTD Actuals',    value: formatCurrency(MOCK_SPEND_BY_MONTH.reduce((s, m) => s + m.revenue, 0), true) },
              { label: 'Confirmed Loads', value: formatCurrency(confirmedRev) },
            ].map(({ label, value }) => (
              <div key={label} className="text-right sm:text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">{label}</p>
                <p className="text-xl font-bold tabular-nums text-gray-900 dark:text-zinc-50 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Forecast chart */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Revenue Trend + 90-Day Forecast</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Oct 2023 – Jun 2024 · shaded = confidence band</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: green }} />Actual</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: purple }} />Forecast</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={FORECAST_DATA} margin={{ top: 4, right: 16, left: 0, bottom: -10 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={green} stopOpacity={darkMode ? 0.22 : 0.15} />
                <stop offset="100%" stopColor={green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={purple} stopOpacity={darkMode ? 0.22 : 0.15} />
                <stop offset="100%" stopColor={purple} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={purple} stopOpacity={0.1} />
                <stop offset="100%" stopColor={purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={48} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
            <ReferenceLine x="Mar" stroke={gridColor} strokeDasharray="4 2" label={{ value: 'Today', fill: tickColor, fontSize: 10, position: 'top' }} />
            {/* Confidence band (high - low shading) */}
            <Area type="monotone" dataKey="high" fill="url(#bandGrad)" stroke="none" dot={false} legendType="none" />
            <Area type="monotone" dataKey="low"  fill={darkMode ? '#09090b' : '#fff'} stroke="none" dot={false} legendType="none" />
            {/* Actual line */}
            <Line type="monotone" dataKey="actual" name="Actual" stroke={green} strokeWidth={2.5}
              dot={{ fill: green, r: 3 }} connectNulls={false} />
            {/* Projected line (dashed) */}
            <Line type="monotone" dataKey="projected" name="Projected" stroke={purple} strokeWidth={2.5}
              strokeDasharray="6 3" dot={{ fill: purple, r: 3 }} connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Scenario cards */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">What-If Scenarios · click to compare</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SCENARIOS.map((s, i) => {
            const Icon = s.icon
            const isActive = active === s.id
            const lift = s.monthly - baseScenario.monthly
            return (
              <motion.button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'text-left rounded-xl border px-5 py-4 transition-all duration-150',
                  isActive
                    ? 'bg-gray-900 dark:bg-zinc-50 border-gray-900 dark:border-zinc-50'
                    : `bg-white dark:bg-zinc-900 ${s.color} hover:border-gray-300 dark:hover:border-zinc-600`
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center',
                    isActive ? 'bg-white/10' : 'bg-gray-100 dark:bg-zinc-800'
                  )}>
                    <Icon className={cn('h-4 w-4', isActive ? 'text-white dark:text-zinc-900' : 'text-gray-500 dark:text-zinc-400')} />
                  </div>
                  {lift > 0 && (
                    <span className={cn('flex items-center gap-1 text-xs font-bold',
                      isActive ? 'text-white/70 dark:text-zinc-900/60' : 'text-emerald-600'
                    )}>
                      <Plus className="h-3 w-3" />{formatCurrency(lift, true)}/mo
                    </span>
                  )}
                </div>
                <p className={cn('text-base font-bold mb-0.5', isActive ? 'text-white dark:text-zinc-900' : 'text-gray-900 dark:text-zinc-50')}>
                  {s.label}
                </p>
                <p className={cn('text-2xl font-bold tabular-nums tracking-tight',
                  isActive ? 'text-white dark:text-zinc-900' : 'text-[#2D6A4F] dark:text-[#C8F400]'
                )}>
                  {formatCurrency(s.monthly, true)}<span className={cn('text-sm font-medium ml-1', isActive ? 'text-white/60 dark:text-zinc-900/50' : 'text-gray-400 dark:text-zinc-500')}>/mo</span>
                </p>
                <p className={cn('text-xs mt-2 leading-relaxed', isActive ? 'text-white/70 dark:text-zinc-900/60' : 'text-gray-400 dark:text-zinc-500')}>
                  {s.description}
                </p>
                {isActive && (
                  <motion.div
                    className="mt-4 pt-3 border-t border-white/10 dark:border-zinc-900/10 space-y-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {s.changes.map((c, ci) => (
                      <p key={ci} className="text-xs text-white/70 dark:text-zinc-900/60 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">·</span>{c}
                      </p>
                    ))}
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Load pipeline table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">April Load Pipeline</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
              {PIPELINE.length} loads · {formatCurrency(pipelineTotal)} total revenue · {formatCurrency(confirmedRev)} confirmed
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500">{CURRENT_MONTH_LABEL}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {['Load #', 'Origin', 'Destination', 'Equipment', 'Revenue', 'Pickup', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {PIPELINE.map((load, i) => (
                <motion.tr
                  key={load.load}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-zinc-50">{load.load}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">{load.origin}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">{load.dest}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                      {load.equip}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(load.revenue)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">{load.pickup}</td>
                  <td className="px-6 py-4"><StatusBadge status={load.status} /></td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                <td colSpan={4} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Pipeline Total</td>
                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(pipelineTotal)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
