import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_SAVINGS, MOCK_INVOICES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

const SAVINGS_BY_TYPE = [
  { label: 'Rate Discrepancy',         amount: 8420, count: 12 },
  { label: 'Unauthorized Accessorial', amount: 6840, count: 8  },
  { label: 'Wrong Weight / Miles',     amount: 4740, count: 6  },
  { label: 'Duplicate Charge',         amount: 2100, count: 3  },
]

const totalSavingsByType = SAVINGS_BY_TYPE.reduce((s, t) => s + t.amount, 0)

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function SavingsPage() {
  const { darkMode } = useUIStore()
  const green      = darkMode ? '#C8F400' : '#2D6A4F'
  const gridColor  = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor  = darkMode ? '#71717a' : '#9ca3af'

  const totalSavings       = MOCK_SAVINGS.reduce((s, m) => s + m.amount, 0)
  const invoicesWithSavings = MOCK_INVOICES.filter(i => (i.savings_identified ?? 0) > 0)
  const totalAudited       = invoicesWithSavings.length + 28
  const recoveryRate       = ((invoicesWithSavings.length / totalAudited) * 100).toFixed(0)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Savings</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Audit recovery & overcharge detection</p>
        </div>
      </div>

      {/* KPI strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-12 gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Total Savings (YTD)', value: formatCurrency(totalSavings), sub: 'Audit engine recoveries',      alert: false },
          { label: 'Invoices Audited',    value: String(totalAudited),         sub: `${CURRENT_MONTH_LABEL} YTD`,  alert: false },
          { label: 'Recovery Rate',       value: `${recoveryRate}%`,           sub: 'Invoices with discrepancies', alert: false },
          { label: 'Issue Types Found',   value: String(SAVINGS_BY_TYPE.length), sub: 'Distinct discrepancy types', alert: false },
        ].map(({ label, value, sub, alert }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className={cn('text-3xl font-bold tabular-nums tracking-tight mt-1', alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            {sub && <p className={cn('text-xs mt-0.5', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Monthly savings bar chart */}
        <motion.div
          className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-0.5">Monthly Savings Trend</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Overcharges identified by audit engine · Oct 2023 – Mar 2024</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_SAVINGS} margin={{ top: 4, right: 8, left: 0, bottom: -10 }}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={green} stopOpacity={darkMode ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor={green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={40} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="amount" name="Savings" stroke={green} strokeWidth={2.5} fill="url(#savingsGrad)" dot={false} activeDot={{ r: 4, fill: green, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Savings by type */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-0.5">Savings by Issue Type</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">YTD · {formatCurrency(totalSavingsByType)} total</p>
          <div className="space-y-4">
            {SAVINGS_BY_TYPE.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{item.count} issues</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums w-16 text-right">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gray-800 dark:bg-zinc-300" style={{ width: `${(item.amount / SAVINGS_BY_TYPE[0].amount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Savings log */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Savings Log</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Invoices where discrepancies were identified</p>
          </div>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{invoicesWithSavings.length} invoices</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Invoice', 'Counterparty', 'Discrepancies', 'Status', 'Savings Found'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {invoicesWithSavings.map((inv, i) => (
              <motion.tr
                key={inv.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                onClick={() => window.location.href = `/dashboard/finance/invoices/${inv.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">{inv.invoice_number}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300">{inv.counterparty_name}</td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-zinc-400 tabular-nums">
                    {inv.discrepancies?.length ?? 0} found
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                    inv.status === 'disputed'
                      ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900'
                      : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900'
                  )}>
                    {inv.status === 'disputed' ? 'Disputed' : 'Under Review'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-green-600 tabular-nums">{formatCurrency(inv.savings_identified)}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <td colSpan={4} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Total Identified</td>
              <td className="px-6 py-3 text-sm font-bold text-green-600 tabular-nums">
                {formatCurrency(invoicesWithSavings.reduce((s, i) => s + (i.savings_identified ?? 0), 0))}
              </td>
            </tr>
          </tfoot>
        </table></div>
      </motion.div>
    </div>
  )
}
