import { motion } from 'framer-motion'
import { Users, Calendar, DollarSign, TrendingUp, Download, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { useUIStore } from '@/stores/uiStore'

/* ── inline data ─────────────────────────────────────────────────────────── */

const CURRENT_PAY_RUN = [
  { name: 'Marcus Williams',  role: 'Driver',     payType: 'Per Mile', earnings: 6840,  deductions: 1231, net: 5609, status: 'Pending' },
  { name: 'Sandra Chen',      role: 'Driver',     payType: 'Per Mile', earnings: 5920,  deductions: 1066, net: 4854, status: 'Pending' },
  { name: 'Derek Johnson',    role: 'Driver',     payType: 'Per Mile', earnings: 6200,  deductions: 1116, net: 5084, status: 'Pending' },
  { name: 'Elena Rodriguez',  role: 'Driver',     payType: 'Per Mile', earnings: 5440,  deductions: 979,  net: 4461, status: 'Pending' },
  { name: 'James Okafor',     role: 'Driver',     payType: 'Per Mile', earnings: 7120,  deductions: 1282, net: 5838, status: 'Pending' },
  { name: 'Jessica Park',     role: 'Dispatcher', payType: 'Salary',   earnings: 3462,  deductions: 623,  net: 2839, status: 'Pending' },
  { name: 'Chris Davis',      role: 'Dispatcher', payType: 'Salary',   earnings: 2885,  deductions: 519,  net: 2366, status: 'Pending' },
  { name: 'Rachel Kim',       role: 'Accountant', payType: 'Salary',   earnings: 3654,  deductions: 658,  net: 2996, status: 'Pending' },
  { name: 'Tom Bradley',      role: 'Mechanic',   payType: 'Hourly',   earnings: 2960,  deductions: 533,  net: 2427, status: 'Pending' },
  { name: 'Lisa Nguyen',      role: 'Admin',      payType: 'Salary',   earnings: 2719,  deductions: 489,  net: 2230, status: 'Pending' },
]

const PAY_HISTORY = [
  { period: 'Mar 1–15, 2024',  employees: 47, gross: 91800,  deductions: 16524, net: 75276, processed: 'Mar 16, 2024', status: 'Paid' },
  { period: 'Feb 16–29, 2024', employees: 46, gross: 88400,  deductions: 15912, net: 72488, processed: 'Mar 1, 2024',  status: 'Paid' },
  { period: 'Feb 1–15, 2024',  employees: 46, gross: 87200,  deductions: 15696, net: 71504, processed: 'Feb 16, 2024', status: 'Paid' },
]

const DEPT_BREAKDOWN = [
  { dept: 'Drivers',       amount: 143520, pct: 78 },
  { dept: 'Dispatchers',   amount: 18694,  pct: 10 },
  { dept: 'Mechanics',     amount: 11840,  pct: 6  },
  { dept: 'Admin/Other',   amount: 10146,  pct: 6  },
]

/* ── helpers ─────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900">
        Paid
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">
      Pending
    </span>
  )
}

function RolePill({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Driver:     'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    Dispatcher: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
    Accountant: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
    Mechanic:   'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    Admin:      'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[role] ?? styles.Admin}`}>
      {role}
    </span>
  )
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default function PayrollPage() {
  const { darkMode } = useUIStore()
  const green = darkMode ? '#C8F400' : '#2D6A4F'

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
            label: 'This Payroll Run',
            value: formatCurrency(184200),
            sub: 'Mar 16 – Mar 31, 2024',
            icon: DollarSign,
          },
          {
            label: 'Next Pay Date',
            value: 'Apr 5, 2024',
            sub: 'Bi-monthly schedule',
            icon: Calendar,
          },
          {
            label: 'Active Employees',
            value: '47',
            sub: 'All departments',
            icon: Users,
          },
          {
            label: 'YTD Payroll',
            value: formatCurrency(892400),
            sub: '6 pay runs completed',
            icon: TrendingUp,
          },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums tracking-tight">{value}</p>
            <p className="text-xs mt-1.5 text-gray-400 dark:text-zinc-500">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Current Pay Run */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Current Pay Run</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Pay Period: Mar 16 – Mar 31, 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors">
              Process Payroll
            </button>
          </div>
        </div>

        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Pay Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Period Earnings</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Deductions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Net Pay</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {CURRENT_PAY_RUN.map((emp) => (
              <tr key={emp.name} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-3.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">{emp.name}</p>
                </td>
                <td className="px-6 py-3.5">
                  <RolePill role={emp.role} />
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400">{emp.payType}</td>
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-zinc-50 tabular-nums text-right">{formatCurrency(emp.earnings)}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums text-right">{formatCurrency(emp.deductions)}</td>
                <td className="px-6 py-3.5 text-sm font-semibold tabular-nums text-right" style={{ color: green }}>{formatCurrency(emp.net)}</td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={emp.status} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <td colSpan={3} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Totals</td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums text-right">
                {formatCurrency(CURRENT_PAY_RUN.reduce((s, e) => s + e.earnings, 0))}
              </td>
              <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums text-right">
                {formatCurrency(CURRENT_PAY_RUN.reduce((s, e) => s + e.deductions, 0))}
              </td>
              <td className="px-6 py-3 text-sm font-bold tabular-nums text-right" style={{ color: green }}>
                {formatCurrency(CURRENT_PAY_RUN.reduce((s, e) => s + e.net, 0))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table></div>
      </motion.div>

      {/* Pay Run History */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Pay Run History</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Previous completed pay runs</p>
          </div>
          <button className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Pay Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Employees</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Gross Pay</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Deductions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Net Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Date Processed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {PAY_HISTORY.map((run) => (
              <tr key={run.period} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-zinc-50">{run.period}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{run.employees}</td>
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-zinc-50 tabular-nums text-right">{formatCurrency(run.gross)}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums text-right">{formatCurrency(run.deductions)}</td>
                <td className="px-6 py-3.5 text-sm font-semibold tabular-nums text-right" style={{ color: green }}>{formatCurrency(run.net)}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400">{run.processed}</td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={run.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </motion.div>

      {/* Payroll by Department */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-1">Payroll by Department</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Mar 16 – Mar 31, 2024 · {formatCurrency(184200)} total</p>

        <div className="space-y-4">
          {DEPT_BREAKDOWN.map((item) => (
            <div key={item.dept}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-600 dark:text-zinc-400">{item.dept}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{item.pct}%</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums w-24 text-right">{formatCurrency(item.amount)}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: green }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-zinc-500">Total payroll this run</span>
          <span className="text-base font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(184200)}</span>
        </div>
      </motion.div>

    </div>
  )
}
