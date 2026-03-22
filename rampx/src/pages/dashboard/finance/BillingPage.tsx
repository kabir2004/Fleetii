import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { MOCK_INVOICES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = ['all', 'pending', 'approved', 'paid', 'overdue'] as const

export default function BillingPage() {
  const navigate = useNavigate()
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const receivables = MOCK_INVOICES.filter(i => i.type === 'receivable')
  const totalAR     = receivables.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.balance_due ?? 0), 0)
  const paidMTD     = receivables.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const overdueCount = receivables.filter(i => i.status === 'overdue').length
  const overdueAmt   = receivables.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.balance_due ?? 0), 0)

  const filtered = receivables.filter(inv => {
    const q = search.toLowerCase()
    const matchSearch = !search || inv.invoice_number.toLowerCase().includes(q) || inv.counterparty_name.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'AR Outstanding',  value: formatCurrency(totalAR),   sub: `${receivables.filter(i => i.status !== 'paid').length} open invoices`, icon: FileText,     alert: false },
          { label: 'Collected MTD',   value: formatCurrency(paidMTD),   sub: `${receivables.filter(i => i.status === 'paid').length} invoices paid`,  icon: CheckCircle,  alert: false },
          { label: 'Overdue',         value: formatCurrency(overdueAmt), sub: `${overdueCount} invoice${overdueCount !== 1 ? 's' : ''} past due`,      icon: AlertTriangle, alert: overdueCount > 0 },
          { label: 'Avg Days to Pay', value: '18d',                     sub: 'March 2024 average',                                                    icon: Clock,        alert: false },
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

      {/* Overdue alert */}
      {overdueCount > 0 && (
        <motion.div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-800 flex-1">
            <span className="font-semibold">{overdueCount} invoice{overdueCount !== 1 ? 's' : ''} overdue</span> — {formatCurrency(overdueAmt)} outstanding. Follow up recommended.
          </p>
          <button className="h-7 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors shrink-0">
            Send Reminders
          </button>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search customer or invoice..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-64"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize', statusFilter === s ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200')}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button className="ml-auto h-9 px-4 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" />
          Create Invoice
        </button>
      </motion.div>

      {/* Table */}
      <motion.div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Customer Invoices</p>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{filtered.length} invoices</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Invoice', 'Customer', 'Status', 'Issued', 'Due Date', 'Total', 'Balance Due'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {filtered.map((inv, i) => (
              <motion.tr
                key={inv.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                onClick={() => navigate(`/dashboard/finance/invoices/${inv.id}`)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">{inv.invoice_number}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Ref: {inv.load_id ?? '—'}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300">{inv.counterparty_name}</td>
                <td className="px-6 py-4"><StatusBadge status={inv.status} type="invoice" /></td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{formatDate(inv.issue_date)}</td>
                <td className="px-6 py-4">
                  <span className={cn('text-sm tabular-nums', inv.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-zinc-400')}>
                    {formatDate(inv.due_date)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(inv.total)}</td>
                <td className="px-6 py-4">
                  <span className={cn('text-sm font-bold tabular-nums', (inv.balance_due ?? 0) > 0 ? 'text-red-600' : 'text-green-600')}>
                    {(inv.balance_due ?? 0) > 0 ? formatCurrency(inv.balance_due ?? 0) : 'Paid'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table></div>
        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 dark:text-zinc-500 py-10">No invoices match your filters</p>}
      </motion.div>
    </div>
  )
}
