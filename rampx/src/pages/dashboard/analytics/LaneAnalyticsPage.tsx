import { motion } from 'framer-motion'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_TOP_LANES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

const totalRevenue  = MOCK_TOP_LANES.reduce((s, l) => s + l.avg_rate * l.loads, 0)
const totalLoads    = MOCK_TOP_LANES.reduce((s, l) => s + l.loads, 0)
const totalMiles    = MOCK_TOP_LANES.reduce((s, l) => s + l.total_miles, 0)
const bestLane      = [...MOCK_TOP_LANES].sort((a, b) => b.avg_rate - a.avg_rate)[0]

const chartData = MOCK_TOP_LANES.map(l => ({
  lane:     `${l.origin.split(',')[0]} → ${l.destination.split(',')[0]}`,
  Revenue:  l.avg_rate * l.loads,
  avg_rate: l.avg_rate,
}))


export default function LaneAnalyticsPage() {
  const { darkMode } = useUIStore()
  const green = darkMode ? '#C8F400' : '#2D6A4F'

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Lane Analytics</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Route performance by corridor</p>
        </div>
      </div>

      {/* KPI strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-12 gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Active Lanes',       value: String(MOCK_TOP_LANES.length), sub: CURRENT_MONTH_LABEL },
          { label: 'Total Lane Revenue', value: formatCurrency(totalRevenue),  sub: `${totalLoads} loads` },
          { label: 'Total Miles Run',    value: `${totalMiles.toLocaleString()} mi`, sub: 'Across all lanes' },
          { label: 'Best Rate Lane',     value: formatCurrency(bestLane.avg_rate),
            sub: `${bestLane.origin.split(',')[0]} → ${bestLane.destination.split(',')[0]}` },
        ].map(({ label, value, sub }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
            {sub && <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500">{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Bar chart */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-0.5">Total Revenue by Lane</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Avg rate × loads · {CURRENT_MONTH_LABEL}</p>
        <div className="space-y-3">
          {chartData.map((lane, i) => {
            const maxRevenue = Math.max(...chartData.map(d => d.Revenue))
            const pct = (lane.Revenue / maxRevenue) * 100
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600 dark:text-zinc-400 truncate max-w-[200px]">{lane.lane}</span>
                  <span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(lane.Revenue, true)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: green }} />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Lane table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Lane Breakdown</p>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{MOCK_TOP_LANES.length} lanes</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['#', 'Lane', 'Loads', 'Total Miles', 'Avg Rate / Load', 'Total Revenue', 'Share'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {[...MOCK_TOP_LANES]
              .sort((a, b) => b.avg_rate * b.loads - a.avg_rate * a.loads)
              .map((lane, i) => {
                const rev   = lane.avg_rate * lane.loads
                const share = Math.round((rev / totalRevenue) * 100)
                return (
                  <motion.tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="px-6 py-4 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">{i + 1}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">
                        {lane.origin.split(',')[0]} → {lane.destination.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{lane.origin} · {lane.destination}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{lane.loads}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{lane.total_miles.toLocaleString()} mi</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(lane.avg_rate)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(rev)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                          <div className="h-full rounded-full bg-gray-700 dark:bg-zinc-300" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{share}%</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <td colSpan={4} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Total</td>
              <td className="px-6 py-3 text-xs text-gray-400 dark:text-zinc-500 tabular-nums">—</td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(totalRevenue)}</td>
              <td className="px-6 py-3 text-xs text-gray-400 dark:text-zinc-500">100%</td>
            </tr>
          </tfoot>
        </table></div>
      </motion.div>
    </div>
  )
}
