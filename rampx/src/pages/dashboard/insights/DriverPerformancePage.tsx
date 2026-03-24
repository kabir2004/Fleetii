import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { formatCurrency, getInitials } from '@/lib/formatters'
import { MOCK_DRIVERS } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

/* ── data ─────────────────────────────────────────────────────────────────── */

const DRIVER_METRICS = MOCK_DRIVERS.map(d => ({
  ...d,
  utilization: d.status === 'on_load' ? 92 : d.status === 'available' ? 68 : 45,
  on_time_pct: d.id === 'driver-1' ? 94 : d.id === 'driver-2' ? 98 : d.id === 'driver-3' ? 89 : d.id === 'driver-4' ? 91 : 96,
  loads_ytd:   d.id === 'driver-1' ? 148 : d.id === 'driver-2' ? 162 : d.id === 'driver-3' ? 121 : d.id === 'driver-4' ? 94 : 178,
  fuel_events: d.id === 'driver-1' ? 2 : d.id === 'driver-2' ? 0 : d.id === 'driver-3' ? 4 : d.id === 'driver-4' ? 1 : 1,
  trend:       (d.id === 'driver-1' || d.id === 'driver-5') ? 'up' : 'down' as 'up' | 'down',
}))

const MONTHLY_MILES = [
  { month: 'Oct', 'Marcus W.': 14200, 'Sandra C.': 15800, 'Derek J.': 12100, 'Elena R.': 9200,  'James O.': 17400 },
  { month: 'Nov', 'Marcus W.': 15100, 'Sandra C.': 16200, 'Derek J.': 12800, 'Elena R.': 9900,  'James O.': 17800 },
  { month: 'Dec', 'Marcus W.': 13800, 'Sandra C.': 14900, 'Derek J.': 11400, 'Elena R.': 8800,  'James O.': 16900 },
  { month: 'Jan', 'Marcus W.': 14600, 'Sandra C.': 15600, 'Derek J.': 12300, 'Elena R.': 9400,  'James O.': 17200 },
  { month: 'Feb', 'Marcus W.': 14900, 'Sandra C.': 16400, 'Derek J.': 11900, 'Elena R.': 9800,  'James O.': 17100 },
  { month: 'Mar', 'Marcus W.': 14820, 'Sandra C.': 15280, 'Derek J.': 11600, 'Elena R.': 9200,  'James O.': 16830 },
]

const COLORS = ['#C8F400', '#818cf8', '#34d399', '#fb923c', '#60a5fa']

function statusCls(s: string) {
  if (s === 'on_load')   return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900'
  if (s === 'available') return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900'
  return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
}

function statusText(s: string) {
  if (s === 'on_load')   return 'On Load'
  if (s === 'available') return 'Available'
  return 'Off Duty'
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          </span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{p.value.toLocaleString()} mi</span>
        </div>
      ))}
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function DriverPerformancePage() {
  const { darkMode } = useUIStore()
  const green     = darkMode ? '#C8F400' : '#2D6A4F'
  const gridColor = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor = darkMode ? '#71717a' : '#9ca3af'

  const [selected, setSelected] = useState<string | null>(null)

  const avgMiles  = Math.round(MOCK_DRIVERS.reduce((s, d) => s + (d.ytd_miles ?? 0), 0) / MOCK_DRIVERS.length)
  const avgSafety = (MOCK_DRIVERS.reduce((s, d) => s + (d.safety_score ?? 0), 0) / MOCK_DRIVERS.length).toFixed(1)
  const topEarner = [...DRIVER_METRICS].sort((a, b) => (b.ytd_earnings ?? 0) - (a.ytd_earnings ?? 0))[0]
  const fleetUtil = Math.round(DRIVER_METRICS.reduce((s, d) => s + d.utilization, 0) / DRIVER_METRICS.length)

  const sel = selected ? DRIVER_METRICS.find(d => d.id === selected) : null

  const radarData = sel ? [
    { metric: 'Miles',       value: Math.round(((sel.ytd_miles ?? 0) / 110000) * 100) },
    { metric: 'Earnings',    value: Math.round(((sel.ytd_earnings ?? 0) / 70000) * 100) },
    { metric: 'Safety',      value: Math.round(((sel.safety_score ?? 0) / 10) * 100) },
    { metric: 'On-Time',     value: sel.on_time_pct },
    { metric: 'Utilization', value: sel.utilization },
    { metric: 'Loads',       value: Math.round((sel.loads_ytd / 190) * 100) },
  ] : []

  return (
    <div className="p-4 md:p-6 w-full space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Driver Performance</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelected(topEarner.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white dark:border-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 transition-colors"
          >
            Focus Top Earner
          </button>
          <button
            onClick={() => setSelected(null)}
            disabled={!selected}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white dark:border-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Avg Miles (YTD)', value: `${avgMiles.toLocaleString()} mi` },
          { label: 'Avg Safety Score', value: `${avgSafety}/10` },
          { label: 'Top Earner', value: formatCurrency(topEarner.ytd_earnings ?? 0), note: `${topEarner.first_name} ${topEarner.last_name}` },
          { label: 'Fleet Utilization', value: `${fleetUtil}%` },
        ].map(({ label, value, note }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">{label}</p>
            <p className="text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
            <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500 min-h-4">{note ?? ''}</p>
          </div>
        ))}
      </motion.div>

      {/* Driver cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {DRIVER_METRICS.map((d, i) => {
          const isSel    = selected === d.id
          const initials = getInitials(d.first_name, d.last_name)
          return (
            <motion.button
              key={d.id}
              onClick={() => setSelected(isSel ? null : d.id)}
              className={cn(
                'text-left rounded-xl border p-4 transition-all duration-150',
                isSel
                  ? 'border-[#2D6A4F] dark:border-[#C8F400] bg-[#2D6A4F]/5 dark:bg-[#C8F400]/5 ring-1 ring-[#2D6A4F] dark:ring-[#C8F400]'
                  : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
              )}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Name + status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-200">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 leading-tight">{d.first_name} {d.last_name}</p>
                    <span className={cn('inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded border mt-0.5', statusCls(d.status))}>
                      {statusText(d.status)}
                    </span>
                  </div>
                </div>
                <span className={cn(
                  'text-[10px] font-semibold uppercase',
                  d.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'
                )}>
                  {d.trend}
                </span>
              </div>

              {/* 4 metrics */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Miles',    value: `${((d.ytd_miles ?? 0) / 1000).toFixed(0)}K` },
                  { label: 'On-Time',  value: `${d.on_time_pct}%`                           },
                  { label: 'Safety',   value: `${d.safety_score}/10`                        },
                  { label: 'Loads',    value: String(d.loads_ytd)                           },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-gray-50 dark:bg-zinc-800/60 px-2 py-1.5">
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500">{label}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{value}</p>
                  </div>
                ))}
              </div>

              {/* Utilization bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500">Utilization</span>
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-zinc-400 tabular-nums">{d.utilization}%</span>
                </div>
                <div className="h-1 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.utilization}%`, background: COLORS[i] }} />
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Detail panel — visible when a card is selected */}
      {sel && (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5">
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-4">{sel.first_name} {sel.last_name}</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: tickColor }} />
                <Radar dataKey="value" stroke={green} fill={green} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5">
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-4">Year-to-date</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Miles',       value: `${(sel.ytd_miles ?? 0).toLocaleString()} mi` },
                { label: 'Earnings',    value: formatCurrency(sel.ytd_earnings ?? 0)         },
                { label: 'Pay Rate',    value: `$${sel.pay_rate ?? 0}/mi`                    },
                { label: 'Safety',      value: `${sel.safety_score}/10`                      },
                { label: 'On-Time',     value: `${sel.on_time_pct}%`                         },
                { label: 'Loads',       value: String(sel.loads_ytd)                         },
                { label: 'Fuel Events', value: String(sel.fuel_events)                       },
                { label: 'Utilization', value: `${sel.utilization}%`                         },
                { label: 'Since',       value: sel.hire_date ? new Date(sel.hire_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-gray-50 dark:bg-zinc-800/60 px-3 py-2.5">
                  <p className="text-xs text-gray-400 dark:text-zinc-500">{label}</p>
                  <p className="text-base font-bold text-gray-900 dark:text-zinc-50 tabular-nums mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Monthly miles chart */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Miles by Driver · Oct – Mar</p>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
            {MOCK_DRIVERS.map((d, i) => (
              <span key={d.id} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                {d.first_name} {d.last_name.charAt(0)}.
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY_MILES} margin={{ top: 4, right: 8, left: 0, bottom: -10 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}K`} width={32} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
            {MOCK_DRIVERS.map((d, i) => (
              <Bar key={d.id} dataKey={`${d.first_name} ${d.last_name.charAt(0)}.`} fill={COLORS[i]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Rankings table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Rankings</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {['#', 'Driver', 'Status', 'YTD Miles', 'Earnings', 'Pay Rate', 'Safety', 'On-Time', 'Loads', 'Fuel Events'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {[...DRIVER_METRICS]
                .sort((a, b) => (b.ytd_miles ?? 0) - (a.ytd_miles ?? 0))
                .map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-300">{getInitials(d.first_name, d.last_name)}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 whitespace-nowrap">{d.first_name} {d.last_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded border', statusCls(d.status))}>
                        {statusText(d.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{(d.ytd_miles ?? 0).toLocaleString()} mi</td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">{formatCurrency(d.ytd_earnings ?? 0)}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">${d.pay_rate ?? 0}/mi</td>
                    <td className="px-5 py-4">
                      <span className={cn('text-sm font-bold tabular-nums',
                        (d.safety_score ?? 0) >= 9 ? 'text-green-600' : (d.safety_score ?? 0) >= 7.5 ? 'text-amber-600' : 'text-red-500'
                      )}>
                        {d.safety_score?.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-300 dark:text-zinc-600 ml-0.5">/10</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{d.on_time_pct}%</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{d.loads_ytd}</td>
                    <td className="px-5 py-4">
                      <span className={cn('text-sm tabular-nums', d.fuel_events > 2 ? 'text-amber-600' : 'text-gray-600 dark:text-zinc-400')}>
                        {d.fuel_events}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
