import { motion } from 'framer-motion'
import { Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { getInitials } from '@/lib/formatters'
import { MOCK_DRIVERS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const HOS_VIOLATIONS = 0
const INCIDENTS_YTD  = 2

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
function scoreLabel(score: number) {
  if (score >= 9)   return { label: 'Excellent', badge: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900' }
  if (score >= 7.5) return { label: 'Good',      badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900' }
  return                   { label: 'At Risk',   badge: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900'     }
}

export default function SafetyPage() {
  const sortedByScore = [...MOCK_DRIVERS].sort((a, b) => (b.safety_score ?? 0) - (a.safety_score ?? 0))
  const avgScore      = MOCK_DRIVERS.reduce((s, d) => s + (d.safety_score ?? 0), 0) / MOCK_DRIVERS.length
  const atRisk        = MOCK_DRIVERS.filter(d => (d.safety_score ?? 10) < 7.5).length

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Fleet Avg Safety Score', value: `${avgScore.toFixed(1)}/10`, sub: 'Driver average',          icon: Shield,      alert: false            },
          { label: 'Incidents YTD',           value: String(INCIDENTS_YTD),      sub: 'Accidents & violations',  icon: AlertTriangle,alert: INCIDENTS_YTD > 0 },
          { label: 'HOS Violations (30d)',    value: String(HOS_VIOLATIONS),     sub: 'Hours-of-service',        icon: Activity,    alert: HOS_VIOLATIONS > 0 },
          { label: 'Drivers at Risk',         value: String(atRisk),             sub: 'Score below 7.5',         icon: TrendingUp,  alert: atRisk > 0        },
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

      {/* Driver rankings table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Driver Safety Rankings</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Sorted by safety score · March 2024</p>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Rank', 'Driver', 'YTD Miles', 'Rating', 'Score', 'Score Bar'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {sortedByScore.map((driver, i) => {
              const score = driver.safety_score ?? 0
              const { label, badge } = scoreLabel(score)
              const initials = getInitials(driver.first_name, driver.last_name)
              return (
                <motion.tr
                  key={driver.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="px-6 py-4 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">#{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300">{initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{driver.first_name} {driver.last_name}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">{(driver as { license_class?: string }).license_class ?? 'CDL-A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">
                    {(driver.ytd_miles ?? 0).toLocaleString()} mi
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', badge)}>
                      {label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-bold tabular-nums', scoreColor(score))}>
                      {score.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-300 dark:text-zinc-600 ml-0.5">/10</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', scoreBg(score))}
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                  </td>
                </motion.tr>
              )
            })}
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
