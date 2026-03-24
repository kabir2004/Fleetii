import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_DRIVERS, MOCK_VEHICLES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { AlertTriangle, CheckCircle2, Zap } from 'lucide-react'

/* ── inline data ──────────────────────────────────────────────────────────── */

const WEEKLY_FUEL_SPEND = [
  { week: 'Oct W1', spend: 31200, gallons: 8400, diesel: 3.71 },
  { week: 'Oct W3', spend: 29800, gallons: 8100, diesel: 3.68 },
  { week: 'Nov W1', spend: 34100, gallons: 9200, diesel: 3.71 },
  { week: 'Nov W3', spend: 33600, gallons: 9000, diesel: 3.73 },
  { week: 'Dec W1', spend: 37200, gallons: 9900, diesel: 3.76 },
  { week: 'Dec W3', spend: 38400, gallons: 10200, diesel: 3.76 },
  { week: 'Jan W1', spend: 36100, gallons: 9600, diesel: 3.76 },
  { week: 'Jan W3', spend: 35200, gallons: 9400, diesel: 3.75 },
  { week: 'Feb W1', spend: 37800, gallons: 10100, diesel: 3.74 },
  { week: 'Feb W3', spend: 36900, gallons: 9900, diesel: 3.73 },
  { week: 'Mar W1', spend: 38100, gallons: 10200, diesel: 3.74 },
  { week: 'Mar W3', spend: 37200, gallons: 9900, diesel: 3.76 },
]

// MPG by truck (tractors only) — derived from typical class-8 averages with variation
const TRUCK_MPG = MOCK_VEHICLES.filter(v => v.vehicle_type === 'tractor').map((v, i) => ({
  unit:     v.unit_number,
  make:     `${v.year} ${v.make} ${v.model}`,
  mpg:      [7.4, 8.1, 6.2, 8.6, 5.9][i] ?? 7.0,
  cpm:      [0.494, 0.453, 0.595, 0.428, 0.625][i] ?? 0.52,
  miles_ytd: [(v.current_mileage ?? 0) * 0.12, (v.current_mileage ?? 0) * 0.15, (v.current_mileage ?? 0) * 0.11, (v.current_mileage ?? 0) * 0.22, (v.current_mileage ?? 0) * 0.09][i] ?? 40000,
  status:   v.status,
}))

// Driver fuel efficiency
const DRIVER_FUEL = MOCK_DRIVERS.map((d, i) => ({
  name: `${d.first_name} ${d.last_name}`,
  short: `${d.first_name} ${d.last_name.charAt(0)}.`,
  mpg: [7.6, 8.2, 6.8, 7.1, 7.9][i] ?? 7.4,
  idle_pct: [4.2, 2.1, 8.8, 5.3, 3.4][i] ?? 5,
  cpm: [0.481, 0.447, 0.541, 0.519, 0.463][i] ?? 0.50,
  flagged: i === 2,
}))

const ANOMALIES = [
  { date: 'Mar 18, 2024', driver: 'Derek Johnson',  truck: 'T-103', type: 'High Idle (>2h)',        gallons: null, amount: null,  severity: 'warn',  detail: '2.4 hrs idle at Chicago yard' },
  { date: 'Mar 15, 2024', driver: 'Marcus Williams', truck: 'T-101', type: 'Out-of-Network Fill',  gallons: 142,  amount: 534,   severity: 'info',  detail: 'Non-preferred station in Memphis, TN' },
  { date: 'Mar 12, 2024', driver: 'Derek Johnson',  truck: 'T-103', type: 'Excessive Consumption', gallons: 228,  amount: 856,   severity: 'warn',  detail: '18% above expected for route length' },
  { date: 'Mar 08, 2024', driver: 'Elena Rodriguez', truck: 'T-104', type: 'Duplicate Transaction', gallons: 89,  amount: 334,   severity: 'error', detail: 'Same station, same amount — 4 min apart' },
  { date: 'Feb 29, 2024', driver: 'James Okafor',   truck: 'T-105', type: 'Large Fill (>200 gal)', gallons: 212,  amount: 794,   severity: 'info',  detail: 'Phoenix AZ — within policy' },
]

const fleetAvgMpg   = (TRUCK_MPG.reduce((s, t) => s + t.mpg, 0) / TRUCK_MPG.length).toFixed(1)
const fleetCpm      = (TRUCK_MPG.reduce((s, t) => s + t.cpm, 0) / TRUCK_MPG.length).toFixed(3)
const anomalyErrors = ANOMALIES.filter(a => a.severity === 'error').length
const anomalyWarns  = ANOMALIES.filter(a => a.severity === 'warn').length

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
            {p.name === 'Diesel $/gal' ? `$${p.value.toFixed(2)}` : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === 'error') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900">
      <AlertTriangle className="h-3 w-3" /> Critical
    </span>
  )
  if (severity === 'warn') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">
      <AlertTriangle className="h-3 w-3" /> Warning
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900">
      <CheckCircle2 className="h-3 w-3" /> Info
    </span>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function FuelIntelligencePage() {
  const { darkMode } = useUIStore()
  const green     = darkMode ? '#C8F400' : '#2D6A4F'
  const purple    = '#818cf8'
  const gridColor = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor = darkMode ? '#71717a' : '#9ca3af'

  const maxMpg = Math.max(...TRUCK_MPG.map(t => t.mpg))
  const maxDriverMpg = Math.max(...DRIVER_FUEL.map(d => d.mpg))
  const [eventFilter, setEventFilter] = useState<'all' | 'critical'>('all')
  const filteredAnomalies = eventFilter === 'critical'
    ? ANOMALIES.filter(a => a.severity === 'error')
    : ANOMALIES

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Fuel Intelligence</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEventFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              eventFilter === 'all'
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
            )}
          >
            All Events
          </button>
          <button
            onClick={() => setEventFilter('critical')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              eventFilter === 'critical'
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
            )}
          >
            Critical Only
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
          { label: 'Fleet Avg MPG',       value: `${fleetAvgMpg} mpg`,     sub: 'Class-8 tractors only',        alert: false },
          { label: 'Avg Cost Per Mile',   value: `$${fleetCpm}/mi`,         sub: 'Fuel only · excl. driver pay',  alert: false },
          { label: 'Anomalies Flagged',   value: String(ANOMALIES.length),  sub: `${anomalyErrors} critical, ${anomalyWarns} warnings`, alert: anomalyErrors > 0 },
          { label: 'Monthly Fuel Spend', value: formatCurrency(148400),    sub: `${CURRENT_MONTH_LABEL} · MTD`, alert: false },
        ].map(({ label, value, sub, alert }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">{label}</p>
            <p className={cn('text-3xl font-bold tabular-nums tracking-tight mt-1',
              alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50'
            )}>{value}</p>
            <p className={cn('text-xs mt-0.5 min-h-4', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Fuel spend trend */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Weekly Fuel Spend</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Oct 2023 – Mar 2024 · bi-weekly intervals</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full inline-block" style={{ background: green }} />
              Fuel Spend
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={WEEKLY_FUEL_SPEND} margin={{ top: 4, right: 8, left: 0, bottom: -10 }}>
            <defs>
              <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={green} stopOpacity={darkMode ? 0.25 : 0.18} />
                <stop offset="100%" stopColor={green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={40} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
            <Area type="monotone" dataKey="spend" name="Fuel Spend" stroke={green} strokeWidth={2.5}
              fill="url(#fuelGrad)" dot={false} activeDot={{ r: 4, fill: green, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* MPG by truck + Driver efficiency side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Truck MPG */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">MPG by Truck</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Class-8 tractors · YTD average</p>
          <div className="space-y-4">
            {[...TRUCK_MPG].sort((a, b) => b.mpg - a.mpg).map((truck, i) => {
              const isBest = truck.mpg === maxMpg
              const isWorst = truck.mpg === Math.min(...TRUCK_MPG.map(t => t.mpg))
              const barColor = isBest ? green : isWorst ? '#f87171' : purple
              return (
                <div key={truck.unit}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{truck.unit}</span>
                      <span className="text-xs text-gray-400 dark:text-zinc-500 ml-2">{truck.make}</span>
                      {truck.status === 'in_maintenance' && (
                        <span className="ml-2 text-[10px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 px-1.5 py-0.5 rounded">In Maint.</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">${truck.cpm}/mi</span>
                      <span className={cn('text-sm font-bold tabular-nums', isBest ? 'text-green-600' : isWorst ? 'text-red-500' : 'text-gray-900 dark:text-zinc-50')}>
                        {truck.mpg} mpg
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(truck.mpg / maxMpg) * 100}%` }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                      style={{ background: barColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Fleet avg</span>
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{fleetAvgMpg} mpg</span>
          </div>
        </motion.div>

        {/* Driver fuel efficiency */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">Driver Fuel Efficiency</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">MPG + idle % · YTD averages</p>
          <div className="space-y-4">
            {[...DRIVER_FUEL].sort((a, b) => b.mpg - a.mpg).map((drv, i) => {
              const isBest  = drv.mpg === maxDriverMpg
              const barColor = isBest ? green : drv.flagged ? '#f87171' : purple
              return (
                <div key={drv.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">{drv.short}</span>
                      {drv.flagged && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 px-1.5 py-0.5 rounded">
                          <Zap className="h-2.5 w-2.5" />High Idle
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-zinc-500">{drv.idle_pct}% idle</span>
                      <span className={cn('text-sm font-bold tabular-nums', isBest ? 'text-green-600' : drv.flagged ? 'text-red-500' : 'text-gray-900 dark:text-zinc-50')}>
                        {drv.mpg} mpg
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(drv.mpg / maxDriverMpg) * 100}%` }}
                      transition={{ delay: 0.12 + i * 0.06, duration: 0.4 }}
                      style={{ background: barColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Fleet avg MPG</span>
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">
              {(DRIVER_FUEL.reduce((s, d) => s + d.mpg, 0) / DRIVER_FUEL.length).toFixed(1)} mpg
            </span>
          </div>
        </motion.div>
      </div>

      {/* Anomaly detection table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Anomaly Detection Log</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
              Flagged by fuel monitoring engine · last 30 days · {ANOMALIES.length} events
            </p>
          </div>
          {anomalyErrors > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900">
              <AlertTriangle className="h-3.5 w-3.5" />
              {anomalyErrors} critical
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {['Date', 'Driver', 'Truck', 'Event Type', 'Amount', 'Detail', 'Severity'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {filteredAnomalies.map((a, i) => (
                <motion.tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">{a.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-zinc-50">{a.driver}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">{a.truck}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-zinc-200">{a.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">
                    {a.amount ? formatCurrency(a.amount) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 max-w-[220px]">{a.detail}</td>
                  <td className="px-6 py-4"><SeverityBadge severity={a.severity} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
