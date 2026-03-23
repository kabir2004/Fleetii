import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, LayoutList, Columns } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Column } from '@/components/shared/DataTable'
import { formatCurrency, formatDate, formatPercent } from '@/lib/formatters'
import { MOCK_LOADS } from '@/lib/mockData'
import type { Load } from '@/types/load.types'
import { cn } from '@/lib/utils'

type ViewMode = 'list' | 'board'

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'at_delivery', label: 'At Delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
  { key: 'disputed', label: 'Disputed' },
]

const BOARD_STATUSES = [
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'at_pickup', label: 'At Pickup' },
  { key: 'at_delivery', label: 'At Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

const COLUMNS: Column<Load>[] = [
  {
    key: 'load_number',
    header: 'Load',
    sortable: true,
    cell: row => <span className="font-medium text-gray-900 dark:text-zinc-50">{row.load_number}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: row => <StatusBadge status={row.status} type="load" />,
  },
  {
    key: 'route',
    header: 'Route',
    cell: row => (
      <span className="text-gray-500 dark:text-zinc-400">
        {row.shipper_address?.city}, {row.shipper_address?.state} → {row.consignee_address?.city}, {row.consignee_address?.state}
      </span>
    ),
  },
  {
    key: 'driver',
    header: 'Driver',
    cell: row => row.driver
      ? <span className="text-gray-700 dark:text-zinc-300">{row.driver.first_name} {row.driver.last_name}</span>
      : <span className="text-gray-400 dark:text-zinc-500">Unassigned</span>,
  },
  {
    key: 'pickup_date',
    header: 'Pickup',
    sortable: true,
    cell: row => <span className="text-gray-500 dark:text-zinc-400 tabular-nums text-xs">{formatDate(row.pickup_date, 'MMM d')}</span>,
  },
  {
    key: 'delivery_date',
    header: 'Delivery',
    sortable: true,
    cell: row => <span className="text-gray-500 dark:text-zinc-400 tabular-nums text-xs">{formatDate(row.delivery_date, 'MMM d')}</span>,
  },
  {
    key: 'customer_rate',
    header: 'Revenue',
    sortable: true,
    align: 'right',
    cell: row => <span className="font-semibold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(row.customer_rate)}</span>,
  },
  {
    key: 'margin',
    header: 'Margin',
    sortable: true,
    align: 'right',
    cell: row => {
      const m = row.margin_percentage ?? 0
      return (
        <span className={cn(
          'font-semibold tabular-nums',
          m >= 25 ? 'text-green-600' : m >= 15 ? 'text-amber-600' : 'text-red-500'
        )}>
          {formatPercent(m, 1)}
        </span>
      )
    },
  },
]

function BoardView({ loads }: { loads: Load[] }) {
  const navigate = useNavigate()
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {BOARD_STATUSES.map(({ key, label }) => {
        const col = loads.filter(l => l.status === key)
        return (
          <div key={key} className="flex-shrink-0 w-60">
            <div className="flex items-center justify-between mb-3.5 px-0.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">{label}</span>
              <span className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">{col.length}</span>
            </div>
            <div className="space-y-2">
              {col.map(load => (
                <div
                  key={load.id}
                  onClick={() => navigate(`/dashboard/loads/${load.id}`)}
                  className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-50 mb-1">{load.load_number}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mb-2.5">
                    {load.shipper_address?.city} → {load.consignee_address?.city}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-zinc-500">
                      {load.driver ? `${load.driver.first_name} ${load.driver.last_name}` : 'Unassigned'}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(load.customer_rate)}</span>
                  </div>
                </div>
              ))}
              {col.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 p-5 text-center text-xs text-gray-300 dark:text-zinc-600">
                  No loads
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const activeLoads = MOCK_LOADS.filter(l => !['completed', 'cancelled'].includes(l.status))
const inTransit = MOCK_LOADS.filter(l => l.status === 'in_transit')
const avgMargin = MOCK_LOADS.reduce((sum, l) => sum + (l.margin_percentage ?? 0), 0) / MOCK_LOADS.length

const KPI_STRIP = [
  { label: 'Total Loads', value: String(MOCK_LOADS.length), sub: '' },
  { label: 'Active', value: String(activeLoads.length), sub: '' },
  { label: 'In Transit', value: String(inTransit.length), sub: '' },
  { label: 'Avg Margin', value: `${avgMargin.toFixed(1)}%`, sub: '' },
]

export default function LoadsListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = MOCK_LOADS.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      l.load_number.toLowerCase().includes(q) ||
      l.shipper_address?.city.toLowerCase().includes(q) ||
      l.consignee_address?.city.toLowerCase().includes(q) ||
      (l.driver && `${l.driver.first_name} ${l.driver.last_name}`.toLowerCase().includes(q))
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Loads</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">All freight movements</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/loads/new')}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Load
        </button>
      </div>

      {/* KPI Strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-12 gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {KPI_STRIP.map(({ label, value, sub }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
            {sub && <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500">{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search loads, routes, drivers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100 focus:border-transparent w-72"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                statusFilter === f.key ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm' : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-1.5 rounded-md transition-colors', viewMode === 'list' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300')}
          >
            <LayoutList className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={cn('p-1.5 rounded-md transition-colors', viewMode === 'board' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300')}
          >
            <Columns className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Selection bar */}
      {selectedKeys.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-900 text-white"
        >
          <span className="text-sm">{selectedKeys.size} selected</span>
          <div className="flex-1" />
          <button className="text-xs text-gray-300 hover:text-white transition-colors">Export</button>
          <button onClick={() => setSelectedKeys(new Set())} className="text-xs text-gray-400 hover:text-white transition-colors">Clear</button>
        </motion.div>
      )}

      {/* Content */}
      {viewMode === 'board' ? (
        <BoardView loads={filtered} />
      ) : (
        <DataTable
          columns={COLUMNS}
          data={filtered}
          keyExtractor={r => r.id}
          onRowClick={r => navigate(`/dashboard/loads/${r.id}`)}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          emptyMessage="No loads match your search"
        />
      )}
    </div>
  )
}
