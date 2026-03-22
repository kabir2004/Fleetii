import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Plus, Search, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { MOCK_PAYMENTS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = ['all', 'pending', 'processing', 'completed', 'failed'] as const

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900',
  processing: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900',
  completed:  'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900',
  failed:     'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',
  refunded:   'bg-purple-50 text-purple-700 border-purple-100',
}

const METHOD_LABEL: Record<string, string> = {
  ach:  'ACH',
  wire: 'Wire',
  check: 'Check',
  card: 'Card',
}

export default function PaymentsPage() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const outgoing      = MOCK_PAYMENTS.filter(p => p.type === 'outgoing')
  const incoming      = MOCK_PAYMENTS.filter(p => p.type === 'incoming')
  const totalOut      = outgoing.reduce((s, p) => s + p.amount, 0)
  const totalIn       = incoming.reduce((s, p) => s + p.amount, 0)
  const pendingCount  = MOCK_PAYMENTS.filter(p => p.status === 'pending').length
  const netFlow       = totalIn - totalOut

  const filtered = MOCK_PAYMENTS.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !search || p.payee_name.toLowerCase().includes(q) || (p.reference_number ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
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
          { label: 'Outgoing (MTD)',  value: formatCurrency(totalOut),  sub: `${outgoing.length} payments`,  icon: ArrowUpRight,   neg: true  },
          { label: 'Incoming (MTD)',  value: formatCurrency(totalIn),   sub: `${incoming.length} payments`,  icon: ArrowDownLeft,  neg: false },
          { label: 'Net Cash Flow',  value: formatCurrency(netFlow),   sub: netFlow >= 0 ? 'Positive' : 'Negative', icon: ArrowDownLeft, neg: netFlow < 0 },
          { label: 'Pending',        value: String(pendingCount),      sub: 'Awaiting processing',           icon: Clock,          neg: pendingCount > 0 },
        ].map(({ label, value, sub, icon: Icon, neg }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            <p className={cn('text-2xl sm:text-3xl font-bold tabular-nums tracking-tight', neg ? 'text-red-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search payee or reference..."
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
          New Payment
        </button>
      </motion.div>

      {/* Table */}
      <motion.div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">All Payments</p>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Direction', 'Payee / Payer', 'Method', 'Reference', 'Date', 'Status', 'Amount'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {filtered.map((p, i) => (
              <motion.tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <td className="px-6 py-4">
                  <div className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
                    p.type === 'outgoing' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900' : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900'
                  )}>
                    {p.type === 'outgoing' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                    {p.type === 'outgoing' ? 'Outgoing' : 'Incoming'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-zinc-100">{p.payee_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">{METHOD_LABEL[p.payment_method] ?? p.payment_method}</td>
                <td className="px-6 py-4 text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{p.reference_number ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{formatDate(p.completed_date ?? p.scheduled_date)}</td>
                <td className="px-6 py-4">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize', STATUS_STYLES[p.status])}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(p.amount)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table></div>
        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 dark:text-zinc-500 py-10">No payments match your filters</p>}
      </motion.div>
    </div>
  )
}
