import { motion } from 'framer-motion'
import { FileBarChart, Download, Play, Plus, Calendar, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const REPORTS = [
  { name: 'Monthly P&L Summary',          type: 'Financial',   last_run: 'Mar 1, 2024',  scheduled: true,  frequency: 'Monthly',  description: 'Revenue, cost, and margin breakdown by month.' },
  { name: 'Carrier Performance Report',   type: 'Operations',  last_run: 'Mar 15, 2024', scheduled: true,  frequency: 'Bi-weekly', description: 'On-time rates, claims, and spend by carrier.' },
  { name: 'Freight Audit Savings Report', type: 'Financial',   last_run: 'Mar 21, 2024', scheduled: false, frequency: 'On demand', description: 'Overcharges identified and recovered by audit engine.' },
  { name: 'Driver Productivity Report',   type: 'Operations',  last_run: 'Mar 10, 2024', scheduled: true,  frequency: 'Monthly',   description: 'Miles, earnings, and safety scores per driver.' },
  { name: 'Fuel Expense Analysis',        type: 'Financial',   last_run: 'Mar 1, 2024',  scheduled: true,  frequency: 'Monthly',   description: 'Fuel spend, price per gallon, and flagged transactions.' },
  { name: 'Lane Profitability Report',    type: 'Operations',  last_run: 'Mar 15, 2024', scheduled: false, frequency: 'On demand', description: 'Revenue and margin breakdown by origin-destination pair.' },
]

const TYPE_COLORS: Record<string, string> = {
  Financial:  'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900',
  Operations: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900',
}

const scheduled   = REPORTS.filter(r => r.scheduled).length
const financial   = REPORTS.filter(r => r.type === 'Financial').length
const operational = REPORTS.filter(r => r.type === 'Operations').length

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Total Reports',      value: String(REPORTS.length), sub: 'Available templates', icon: FileBarChart },
          { label: 'Scheduled',          value: String(scheduled),      sub: 'Auto-generated',      icon: Calendar    },
          { label: 'Financial Reports',  value: String(financial),      sub: 'P&L, audit, fuel',    icon: FileText    },
          { label: 'Operations Reports', value: String(operational),    sub: 'Drivers, lanes, carriers', icon: Clock  },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums tracking-tight">{value}</p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">All Reports</p>
        <button className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" />
          Build Report
        </button>
      </motion.div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((report, i) => (
          <motion.div
            key={report.name}
            className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 flex items-center justify-center">
                <FileBarChart className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', TYPE_COLORS[report.type])}>
                  {report.type}
                </span>
                {report.scheduled && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {report.frequency}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-1">{report.name}</h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500 leading-relaxed mb-4">{report.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                <Clock className="h-3 w-3" />
                Last run: {report.last_run}
              </div>
              <div className="flex items-center gap-2">
                <button className="h-7 px-2.5 rounded-md border border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Export
                </button>
                <button className="h-7 px-2.5 rounded-md bg-gray-900 text-white text-xs hover:bg-gray-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100 transition-colors flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  Run
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
