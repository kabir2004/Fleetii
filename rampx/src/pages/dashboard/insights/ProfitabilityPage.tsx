import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_SPEND_BY_MONTH } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

/* ── inline data ──────────────────────────────────────────────────────────── */

const MONTHLY = MOCK_SPEND_BY_MONTH.map(m => ({
  month:    m.month,
  Revenue:  m.revenue,
  Cost:     m.cost,
  Margin:   parseFloat(((m.revenue - m.cost) / m.revenue * 100).toFixed(1)),
  Profit:   m.revenue - m.cost,
}))

const EQUIPMENT_PROFITABILITY = [
  { type: 'Dry Van',  loads: 84, revenue: 441200, cost: 318400, margin: 27.9, rpm_billed: 2.84, rpm_cost: 2.05 },
  { type: 'Reefer',   loads: 32, revenue: 228800, cost: 171800, margin: 24.9, rpm_billed: 3.41, rpm_cost: 2.56 },
  { type: 'Flatbed',  loads: 18, revenue: 164400, cost: 117200, margin: 28.7, rpm_billed: 3.12, rpm_cost: 2.22 },
  { type: 'Step Deck', loads: 9, revenue:  98200, cost:  72400, margin: 26.3, rpm_billed: 3.54, rpm_cost: 2.61 },
]

const COST_CATEGORIES = [
  { label: 'Driver Pay',         pct: 44, amount: 412800, vs_prev: -1.2 },
  { label: 'Carrier Payments',   pct: 30, amount: 284200, vs_prev: +2.1 },
  { label: 'Fuel',               pct: 16, amount: 148400, vs_prev: -0.8 },
  { label: 'Maintenance',        pct:  6, amount:  52200, vs_prev: +0.3 },
  { label: 'Tolls & Misc',       pct:  4, amount:  36400, vs_prev: +0.1 },
]

const LOAD_MARGINS = [
  { load: 'LD-20241',   origin: 'Chicago, IL',   dest: 'Columbus, OH',   revenue: 8200,  cost: 5420,  margin: 33.9, equip: 'Dry Van'  },
  { load: 'LD-20238',   origin: 'Memphis, TN',   dest: 'Atlanta, GA',    revenue: 7800,  cost: 5200,  margin: 33.3, equip: 'Reefer'   },
  { load: 'LD-20235',   origin: 'Chicago, IL',   dest: 'Dallas, TX',     revenue: 9400,  cost: 6400,  margin: 31.9, equip: 'Flatbed'  },
  { load: 'LD-20229',   origin: 'Indianapolis',  dest: 'Detroit, MI',    revenue: 5600,  cost: 3940,  margin: 29.6, equip: 'Dry Van'  },
  { load: 'LD-20224',   origin: 'Chicago, IL',   dest: 'Kansas City',    revenue: 6200,  cost: 4400,  margin: 29.0, equip: 'Step Deck'},
  // worst margins
  { load: 'LD-20218',   origin: 'St. Louis, MO', dest: 'Louisville, KY', revenue: 3800,  cost: 3420,  margin: 10.0, equip: 'Dry Van'  },
  { load: 'LD-20211',   origin: 'Chicago, IL',   dest: 'Milwaukee, WI',  revenue: 2400,  cost: 2180,  margin:  9.2, equip: 'Dry Van'  },
  { load: 'LD-20205',   origin: 'Gary, IN',      dest: 'Joliet, IL',     revenue: 1900,  cost: 1740,  margin:  8.4, equip: 'Dry Van'  },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
            {p.name === 'Margin' ? `${p.value}%` : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function ProfitabilityPage() {
  const { darkMode } = useUIStore()
  const green      = darkMode ? '#C8F400' : '#2D6A4F'
  const purple     = '#818cf8'
  const gridColor  = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor  = darkMode ? '#71717a' : '#9ca3af'
  const [view, setView] = useState<'top' | 'bottom'>('top')

  const current    = MONTHLY[5]
  const previous   = MONTHLY[4]
  const marginDelta = (current.Margin - previous.Margin).toFixed(1)
  const profitDelta = (((current.Profit - previous.Profit) / previous.Profit) * 100).toFixed(1)
  const totalRevYTD = MONTHLY.reduce((s, m) => s + m.Revenue, 0)
  const bestEquip   = [...EQUIPMENT_PROFITABILITY].sort((a, b) => b.margin - a.margin)[0]

  const displayedLoads = view === 'top'
    ? LOAD_MARGINS.slice(0, 5)
    : LOAD_MARGINS.slice(5)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Profitability</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('top')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              view === 'top'
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
            )}
          >
            Top Margins
          </button>
          <button
            onClick={() => setView('bottom')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              view === 'bottom'
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
            )}
          >
            Bottom Margins
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Gross Margin (MTD)',     value: `${current.Margin}%`,                  sub: `${parseFloat(marginDelta) >= 0 ? '+' : ''}${marginDelta}pp vs last month`, highlight: false },
          { label: 'Net Profit (MTD)',       value: formatCurrency(current.Profit),         sub: `${parseFloat(profitDelta) >= 0 ? '+' : ''}${profitDelta}% vs last month`,  highlight: true  },
          { label: 'Revenue YTD',            value: formatCurrency(totalRevYTD, true),      sub: 'All loads · 6 months',                                                       highlight: false },
          { label: 'Best Margin Segment',   value: `${bestEquip.type}`,                   sub: `${bestEquip.margin}% gross margin`,                                          highlight: false },
        ].map(({ label, value, sub, highlight }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">{label}</p>
            <p className={cn('text-3xl font-bold tabular-nums tracking-tight mt-1',
              highlight ? 'text-[#2D6A4F] dark:text-[#C8F400]' : 'text-gray-900 dark:text-zinc-50'
            )}>{value}</p>
            <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500 min-h-4">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Main chart + cost breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Composed chart — revenue bars + margin line */}
        <motion.div
          className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Revenue, Cost & Margin</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Oct 2023 – Mar 2024 · margin % on right axis</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm inline-block" style={{ background: green }} />Rev</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm inline-block" style={{ background: purple }} />Cost</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 inline-block" style={{ background: '#f97316' }} />Margin %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={MONTHLY} margin={{ top: 4, right: 40, left: 0, bottom: -10 }}>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="money" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={44} />
              <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`} domain={[15, 35]} width={36} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
              <Bar yAxisId="money" dataKey="Revenue" fill={green} opacity={0.85} radius={[3, 3, 0, 0]} />
              <Bar yAxisId="money" dataKey="Cost"    fill={purple} opacity={0.7} radius={[3, 3, 0, 0]} />
              <Line yAxisId="pct" type="monotone" dataKey="Margin" stroke="#f97316" strokeWidth={2}
                dot={{ fill: '#f97316', r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cost structure breakdown */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">Cost Structure</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">{CURRENT_MONTH_LABEL} · {formatCurrency(current.Cost)} total</p>
          <div className="space-y-4">
            {COST_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700 dark:text-zinc-300">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn('flex items-center text-[10px] font-bold',
                      cat.vs_prev <= 0 ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      {cat.vs_prev <= 0 ? '-' : '+'}
                      {Math.abs(cat.vs_prev)}pp
                    </span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-50 tabular-nums w-20 text-right">{formatCurrency(cat.amount, true)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${cat.pct}%`, background: purple }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Total cost</span>
            <span className="text-base font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(current.Cost)}</span>
          </div>
        </motion.div>
      </div>

      {/* Equipment profitability tiles */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Profitability by Equipment Type · {CURRENT_MONTH_LABEL}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EQUIPMENT_PROFITABILITY.map((eq, i) => {
            const profit = eq.revenue - eq.cost
            const isTop  = eq.margin === Math.max(...EQUIPMENT_PROFITABILITY.map(e => e.margin))
            return (
              <motion.div
                key={eq.type}
                className={cn(
                  'rounded-xl border px-5 py-4 bg-white dark:bg-zinc-900',
                  isTop
                    ? 'border-[#2D6A4F]/40 dark:border-[#C8F400]/30'
                    : 'border-gray-200 dark:border-zinc-800'
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{eq.type}</p>
                  {isTop && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2D6A4F]/10 text-[#2D6A4F] dark:bg-[#C8F400]/10 dark:text-[#C8F400] border border-[#2D6A4F]/20 dark:border-[#C8F400]/20">
                      Best
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(profit, true)}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">net profit · {eq.loads} loads</p>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                  {[
                    { label: 'Gross margin', value: `${eq.margin}%` },
                    { label: 'Revenue',      value: formatCurrency(eq.revenue, true) },
                    { label: 'RPM billed',   value: `$${eq.rpm_billed}/mi` },
                    { label: 'RPM cost',     value: `$${eq.rpm_cost}/mi`   },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-zinc-500">{label}</span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Margin bar */}
                <div className="mt-3">
                  <div className="h-1 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${eq.margin * 3}%`, background: isTop ? green : purple }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Load-level margin table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Load-Level Margin Detail</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Per-load profitability breakdown</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
            {(['top', 'bottom'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  view === v
                    ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                )}
              >
                {v === 'top' ? 'Top 5' : 'Bottom 3'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {['Load #', 'Origin', 'Destination', 'Equipment', 'Revenue', 'Cost', 'Margin', 'Profit'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {displayedLoads.map((load, i) => (
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
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">{formatCurrency(load.revenue)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">{formatCurrency(load.cost)}</td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-bold tabular-nums',
                      load.margin >= 25 ? 'text-green-600' : load.margin >= 15 ? 'text-amber-600' : 'text-red-500'
                    )}>
                      {load.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
                    {formatCurrency(load.revenue - load.cost)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
