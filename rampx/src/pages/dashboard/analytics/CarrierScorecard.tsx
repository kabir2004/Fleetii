import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_SPEND_BY_CARRIER } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const SCORECARDS = MOCK_SPEND_BY_CARRIER.map((c, i) => ({
  ...c,
  on_time: [87, 94, 82, 96, 78][i],
  claims:  [2,  0,  4,  1,  3][i],
  score:   [7.8, 9.4, 7.1, 9.6, 6.8][i],
  trend:   [+0.3, +0.1, -0.5, +0.2, -0.2][i],
})).sort((a, b) => b.score - a.score)

const avgScore   = (SCORECARDS.reduce((s, c) => s + c.score, 0) / SCORECARDS.length).toFixed(1)
const bestOnTime = Math.max(...SCORECARDS.map(c => c.on_time))
const openClaims = SCORECARDS.reduce((s, c) => s + c.claims, 0)

function scoreColor(score: number) {
  if (score >= 9)   return 'text-green-600'
  if (score >= 7.5) return 'text-amber-600'
  return 'text-red-500'
}
function scoreBg(score: number) {
  if (score >= 9)   return 'bg-green-500'
  if (score >= 7.5) return 'bg-amber-400'
  return 'bg-red-500'
}
function onTimeColor(pct: number) {
  if (pct >= 90) return 'text-green-600'
  if (pct >= 80) return 'text-amber-600'
  return 'text-red-500'
}

export default function CarrierScorecard() {
  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Carrier Ratings</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Vendor performance & reliability scoring</p>
        </div>
      </div>

      {/* KPI strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-12 gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Carriers Tracked',   value: String(SCORECARDS.length), sub: 'Active relationships',  alert: false },
          { label: 'Avg Carrier Score',  value: `${avgScore}/10`,          sub: 'Fleet average',         alert: false },
          { label: 'Best On-Time Rate',  value: `${bestOnTime}%`,          sub: 'Top carrier',           alert: false },
          { label: 'Open Claims',        value: String(openClaims),        sub: 'Across all carriers',   alert: openClaims > 0 },
        ].map(({ label, value, sub, alert }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className={cn('text-3xl font-bold tabular-nums tracking-tight mt-1', alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            {sub && <p className={cn('text-xs mt-0.5', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Carrier table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Carrier Rankings</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Sorted by overall score · {CURRENT_MONTH_LABEL}</p>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Rank', 'Carrier', 'Total Spend', 'Loads', 'On-Time', 'Claims', 'Score', 'Trend', 'Rating Bar'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {SCORECARDS.map((c, i) => (
              <motion.tr
                key={c.name}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="px-6 py-4 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">#{i + 1}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{c.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{formatCurrency(c.amount)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{c.loads}</td>
                <td className="px-6 py-4">
                  <span className={cn('text-sm font-semibold tabular-nums', onTimeColor(c.on_time))}>
                    {c.on_time}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn('text-sm tabular-nums',
                    c.claims === 0 ? 'text-green-600' : c.claims <= 2 ? 'text-amber-600' : 'text-red-500'
                  )}>
                    {c.claims}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn('text-sm font-bold tabular-nums', scoreColor(c.score))}>
                    {c.score.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-zinc-600 ml-0.5">/10</span>
                </td>
                <td className="px-6 py-4">
                  <div className={cn('flex items-center gap-1 text-xs font-medium', c.trend >= 0 ? 'text-green-600' : 'text-red-500')}>
                    {c.trend >= 0
                      ? <TrendingUp className="h-3.5 w-3.5" />
                      : <TrendingDown className="h-3.5 w-3.5" />
                    }
                    {c.trend >= 0 ? '+' : ''}{c.trend.toFixed(1)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', scoreBg(c.score))}
                        style={{ width: `${c.score * 10}%` }}
                      />
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table></div>
      </motion.div>

      {/* Score legend */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Score Guide</p>
        {[
          { label: 'Excellent  9.0–10', color: 'bg-green-500' },
          { label: 'Good  7.5–8.9',     color: 'bg-amber-400' },
          { label: 'At Risk  < 7.5',    color: 'bg-red-500'   },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', color)} />
            <span className="text-xs text-gray-500 dark:text-zinc-400">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
