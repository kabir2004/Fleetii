import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Upload, Plus, ShieldAlert } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { MOCK_INVOICES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const TYPE_FILTERS   = ['all', 'payable', 'receivable'] as const
const STATUS_FILTERS = ['all', 'pending', 'under_review', 'disputed', 'approved', 'paid', 'overdue'] as const

export default function InvoicesPage() {
  const navigate = useNavigate()
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected]       = useState<Set<string>>(new Set())

  const filtered = MOCK_INVOICES.filter(inv => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.counterparty_name.toLowerCase().includes(q)
    const matchType   = typeFilter   === 'all' || inv.type   === typeFilter
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(i => i.id)))
  }

  /* derived KPIs */
  const totalSavings  = MOCK_INVOICES.reduce((s, i) => s + (i.savings_identified ?? 0), 0)
  const totalPayable  = MOCK_INVOICES.filter(i => i.type === 'payable' && i.status !== 'paid').reduce((s, i) => s + (i.balance_due ?? 0), 0)
  const totalReceivable = MOCK_INVOICES.filter(i => i.type === 'receivable' && i.status !== 'paid').reduce((s, i) => s + (i.balance_due ?? 0), 0)
  const disputed      = MOCK_INVOICES.filter(i => i.status === 'disputed').length
  const overdue       = MOCK_INVOICES.filter(i => i.status === 'overdue').length

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Invoices</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Accounts payable & receivable</p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
          <button className="h-9 px-4 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-12 gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Outstanding Payable',    value: formatCurrency(totalPayable),    sub: 'Awaiting payment',                                                      alert: false },
          { label: 'Outstanding Receivable', value: formatCurrency(totalReceivable), sub: 'To be collected',                                                        alert: overdue > 0 },
          { label: 'Disputed',               value: String(disputed),                sub: `${disputed} invoice${disputed !== 1 ? 's' : ''} under review`,           alert: disputed > 0 },
          { label: 'Savings Identified',     value: formatCurrency(totalSavings),    sub: 'Audit engine recoveries',                                                 alert: false },
        ].map(({ label, value, sub, alert }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className={cn('text-3xl font-bold tabular-nums tracking-tight mt-1', alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            {sub && <p className={cn('text-xs mt-0.5', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Audit alert banner */}
      {totalSavings > 0 && (
        <motion.div
          className="rounded-xl border border-green-200 bg-green-50 px-5 py-3.5 flex items-center gap-3"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="h-7 w-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-3.5 w-3.5 text-green-600" />
          </div>
          <p className="text-sm text-green-800 flex-1">
            <span className="font-semibold">Audit Alert —</span> Fleetii identified{' '}
            <span className="font-bold tabular-nums">{formatCurrency(totalSavings)}</span> in potential overcharges across{' '}
            {MOCK_INVOICES.filter(i => (i.savings_identified ?? 0) > 0).length} invoices.
          </p>
          <button className="h-7 px-3 rounded-lg border border-green-200 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors shrink-0">
            Review All
          </button>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search invoices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-64"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {TYPE_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize',
                typeFilter === t ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              )}
            >
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                statusFilter === s ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              )}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 px-5 py-2.5 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{selected.size} selected</span>
          <div className="flex-1" />
          <button className="h-7 px-3 rounded-md border border-gray-200 dark:border-zinc-700 text-xs text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 transition-colors">
            Approve
          </button>
          <button className="h-7 px-3 rounded-md border border-red-100 text-xs text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            Dispute
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="h-7 px-3 rounded-md text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">All Invoices</p>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{filtered.length} of {MOCK_INVOICES.length}</span>
        </div>

        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <th className="w-10 px-5 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
              </th>
              {['Invoice', 'Counterparty', 'Type', 'Status', 'Amount', 'Due Date', 'Savings'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {filtered.map((inv, i) => (
              <motion.tr
                key={inv.id}
                className={cn(
                  'hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors',
                  selected.has(inv.id) && 'bg-blue-50/60'
                )}
                onClick={() => navigate(`/dashboard/finance/invoices/${inv.id}`)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <td className="w-10 px-5 py-4" onClick={e => { e.stopPropagation(); toggleSelect(inv.id) }}>
                  <input
                    type="checkbox"
                    checked={selected.has(inv.id)}
                    onChange={() => toggleSelect(inv.id)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">{inv.invoice_number}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Issued {formatDate(inv.issue_date)}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-zinc-300">{inv.counterparty_name}</td>
                <td className="px-5 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                    inv.type === 'payable'
                      ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900'
                      : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900'
                  )}>
                    {inv.type === 'payable' ? 'Payable' : 'Receivable'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={inv.status} type="invoice" />
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(inv.total)}</p>
                  {(inv.balance_due ?? 0) > 0 && (inv.balance_due ?? 0) < inv.total && (
                    <p className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{formatCurrency(inv.balance_due ?? 0)} due</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className={cn(
                    'text-sm tabular-nums',
                    inv.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-zinc-400'
                  )}>
                    {formatDate(inv.due_date)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  {(inv.savings_identified ?? 0) > 0 ? (
                    <span className="text-sm font-semibold text-green-600 tabular-nums">
                      {formatCurrency(inv.savings_identified)}
                    </span>
                  ) : (
                    <span className="text-gray-300 dark:text-zinc-600">—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table></div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400 dark:text-zinc-500">No invoices match your filters</div>
        )}
      </motion.div>
    </div>
  )
}
