import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { useUIStore } from '@/stores/uiStore'

/* ── inline data ─────────────────────────────────────────────────────────── */

const CASH_FLOW_DATA = [
  { month: 'Oct', inflow: 980000,  outflow: 764000 },
  { month: 'Nov', inflow: 1050000, outflow: 812000 },
  { month: 'Dec', inflow: 1120000, outflow: 856000 },
  { month: 'Jan', inflow: 1180000, outflow: 897000 },
  { month: 'Feb', inflow: 1198000, outflow: 908000 },
  { month: 'Mar', inflow: 1247800, outflow: 934000 },
]

const INFLOWS = [
  { label: 'Freight Revenue',   value: 1124200, pct: 90 },
  { label: 'Fuel Surcharges',   value: 87400,   pct: 7  },
  { label: 'Accessorial Fees',  value: 36200,   pct: 3  },
]

const OUTFLOWS = [
  { label: 'Driver Pay & Payroll', value: 412800, pct: 44 },
  { label: 'Carrier Payments',     value: 284200, pct: 30 },
  { label: 'Fuel',                 value: 148400, pct: 16 },
  { label: 'Maintenance',          value: 52200,  pct: 6  },
  { label: 'Tolls & Misc',         value: 36400,  pct: 4  },
]

const OBLIGATIONS = [
  { description: 'FastRoute Carrier Svcs invoice', due: 'Apr 2, 2024',  amount: 28400, category: 'Carrier Payment', status: 'Due Soon'  },
  { description: 'Driver Payroll Run',             due: 'Apr 5, 2024',  amount: 92100, category: 'Payroll',         status: 'Scheduled' },
  { description: 'Fuel Card Settlement',           due: 'Apr 7, 2024',  amount: 31200, category: 'Fuel',            status: 'Scheduled' },
  { description: 'Midwest Freight Express',        due: 'Apr 9, 2024',  amount: 19800, category: 'Carrier Payment', status: 'Pending'   },
  { description: 'Insurance Premium',              due: 'Apr 15, 2024', amount: 8400,  category: 'Insurance',       status: 'Pending'   },
]

/* ── helpers ─────────────────────────────────────────────────────────────── */

function ObligationBadge({ status }: { status: string }) {
  if (status === 'Due Soon') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">
        Due Soon
      </span>
    )
  }
  if (status === 'Scheduled') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900">
        Scheduled
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
      Pending
    </span>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function BreakdownBars({ items, green }: { items: { label: string; value: number; pct: number }[]; green: string }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-gray-600 dark:text-zinc-400">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{item.pct}%</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums w-24 text-right">{formatCurrency(item.value)}</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: green }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default function CashFlowPage() {
  const { darkMode } = useUIStore()
  const green      = darkMode ? '#C8F400' : '#2D6A4F'
  const gridColor  = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor  = darkMode ? '#71717a' : '#9ca3af'
  const outColor   = '#818cf8'

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          {
            label: 'Cash Balance',
            value: formatCurrency(1284600),
            sub: 'Current treasury position',
            icon: Wallet,
            highlight: true,
          },
          {
            label: 'Monthly Inflow',
            value: formatCurrency(1247800),
            sub: 'March 2024',
            icon: TrendingUp,
            highlight: false,
          },
          {
            label: 'Monthly Outflow',
            value: formatCurrency(934000),
            sub: 'March 2024',
            icon: TrendingDown,
            highlight: false,
          },
          {
            label: 'Net Cash Flow',
            value: '+$313,800',
            sub: 'March 2024',
            icon: ArrowUpRight,
            highlight: true,
          },
        ].map(({ label, value, sub, icon: Icon, highlight }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            {highlight ? (
              <p className="text-lg font-bold tabular-nums" style={{ color: green }}>{value}</p>
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums tracking-tight">{value}</p>
            )}
            <p className="text-xs mt-1.5 text-gray-400 dark:text-zinc-500">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Cash Flow Trend chart */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Cash Flow Trend</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Oct 2023 – Mar 2024 · inflow vs outflow</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full inline-block" style={{ background: green }} />
              Inflow
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full inline-block" style={{ background: outColor }} />
              Outflow
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={CASH_FLOW_DATA} margin={{ top: 4, right: 16, left: 0, bottom: -10 }}>
            <defs>
              <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={green} stopOpacity={darkMode ? 0.25 : 0.18} />
                <stop offset="100%" stopColor={green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={outColor} stopOpacity={0.18} />
                <stop offset="100%" stopColor={outColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: tickColor }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
              domain={[600000, 'auto']}
              tickCount={5}
              width={52}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="inflow"
              name="Inflow"
              stroke={green}
              strokeWidth={2.5}
              fill="url(#inflowGrad)"
              dot={false}
              activeDot={{ r: 4, fill: green, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="outflow"
              name="Outflow"
              stroke={outColor}
              strokeWidth={2.5}
              fill="url(#outflowGrad)"
              dot={false}
              activeDot={{ r: 4, fill: outColor, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Cash Flow Breakdown — two side-by-side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Inflows by Source */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-1">Inflows by Source</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">March 2024 · {formatCurrency(1247800)} total</p>
          <BreakdownBars items={INFLOWS} green={green} />
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Total inflow</span>
            <span className="text-base font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(1247800)}</span>
          </div>
        </motion.div>

        {/* Outflows by Category */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-1">Outflows by Category</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">March 2024 · {formatCurrency(934000)} total</p>
          <BreakdownBars items={OUTFLOWS} green={green} />
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Total outflow</span>
            <span className="text-base font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(934000)}</span>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Cash Obligations */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Upcoming Cash Obligations</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Next 30 days · {formatCurrency(179900)} total due</p>
          </div>
        </div>

        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Due Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {OBLIGATIONS.map((item) => (
              <tr key={item.description} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-zinc-50">{item.description}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400">{item.due}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums text-right">{formatCurrency(item.amount)}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400">{item.category}</td>
                <td className="px-6 py-3.5">
                  <ObligationBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <td colSpan={2} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Total</td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums text-right">
                {formatCurrency(OBLIGATIONS.reduce((s, o) => s + o.amount, 0))}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table></div>
      </motion.div>

    </div>
  )
}
