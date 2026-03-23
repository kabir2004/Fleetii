import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Truck, AlertTriangle, MapPin, Gauge, Wrench, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/formatters'
import { MOCK_VEHICLES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = [
  { key: 'all',            label: 'All' },
  { key: 'active',         label: 'Active' },
  { key: 'in_maintenance', label: 'In Maintenance' },
  { key: 'out_of_service', label: 'Out of Service' },
]

const active      = MOCK_VEHICLES.filter(v => v.status === 'active').length
const maintenance = MOCK_VEHICLES.filter(v => v.status === 'in_maintenance').length
const utilization = Math.round((active / MOCK_VEHICLES.length) * 100)

const KPI_STRIP = [
  { label: 'Total Vehicles',    value: String(MOCK_VEHICLES.length), sub: '' },
  { label: 'Active',            value: String(active),               sub: '' },
  { label: 'In Maintenance',    value: String(maintenance),          sub: '' },
  { label: 'Fleet Utilization', value: `${utilization}%`,           sub: '' },
]

export default function FleetOverviewPage() {
  const navigate  = useNavigate()
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = MOCK_VEHICLES.filter(v => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      v.unit_number.toLowerCase().includes(q) ||
      (v.make ?? '').toLowerCase().includes(q) ||
      (v.model ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  const now = Date.now()
  const soon14  = now + 14  * 86_400_000
  const soon30  = now + 30  * 86_400_000

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Fleet</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Vehicle inventory & management</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/fleet/new')}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Vehicle
        </button>
      </div>

      {/* KPI Strip */}
      <motion.div
        className="flex flex-wrap items-start gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {KPI_STRIP.map(({ label, value, sub }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-xl sm:text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
            {sub && <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500">{sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div className="flex flex-wrap gap-2 sm:gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search by unit, make, model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100 focus:border-transparent w-full sm:w-72"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                statusFilter === f.key
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((vehicle, i) => {
          const maintenanceSoon = vehicle.next_maintenance_date && new Date(vehicle.next_maintenance_date).getTime() <= soon14
          const insuranceExpiring = vehicle.insurance_expiry && new Date(vehicle.insurance_expiry).getTime() <= soon30
          const alerts = (maintenanceSoon ? 1 : 0) + (insuranceExpiring ? 1 : 0)

          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/dashboard/fleet/${vehicle.id}`)}
              className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">{vehicle.unit_number}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={vehicle.status} type="vehicle" />
                  {alerts > 0 && (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-1.5 py-0.5 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />{alerts} alert{alerts > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                    {vehicle.last_known_location
                      ? `${vehicle.last_known_location.city}, ${vehicle.last_known_location.state}`
                      : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Gauge className="h-3 w-3" /> Mileage
                  </p>
                  <p className="text-xs font-medium text-gray-700 dark:text-zinc-300 tabular-nums">
                    {vehicle.current_mileage?.toLocaleString() ?? '—'} mi
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Wrench className="h-3 w-3" /> Next Service
                  </p>
                  <p className={cn('text-xs font-medium tabular-nums', maintenanceSoon ? 'text-amber-600' : 'text-gray-700 dark:text-zinc-300')}>
                    {formatDate(vehicle.next_maintenance_date)}
                    {maintenanceSoon && <span className="ml-1 text-amber-600">· Due soon</span>}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Insurance
                  </p>
                  <p className={cn('text-xs font-medium tabular-nums', insuranceExpiring ? 'text-red-500' : 'text-gray-700 dark:text-zinc-300')}>
                    {formatDate(vehicle.insurance_expiry)}
                    {insuranceExpiring && <span className="ml-1 text-red-500">· Expiring</span>}
                  </p>
                </div>
              </div>

              {/* Vehicle type tag */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/50 flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-zinc-500 capitalize">{vehicle.vehicle_type?.replace('_', ' ')}</span>
                <span className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{vehicle.license_plate}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
