import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Truck, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { MOCK_VEHICLES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

/* ── expiry helper ────────────────────────────────────────────────────────── */

function expiryMeta(dateStr: string | undefined) {
  if (!dateStr) return { days: null, level: 'ok' as const }
  const days = Math.floor((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
  if (days < 0)  return { days, level: 'expired' as const }
  if (days < 30) return { days, level: 'critical' as const }
  if (days < 60) return { days, level: 'warning' as const }
  return { days, level: 'ok' as const }
}

/* ── mock data ────────────────────────────────────────────────────────────── */

const MAINTENANCE_HISTORY = [
  { date: '2024-01-15', type: 'Oil & Filter Change',           mileage: 382000, cost: 285,  shop: 'Freightliner Chicago' },
  { date: '2023-10-08', type: 'Brake Inspection & Adjustment', mileage: 360000, cost: 1240, shop: 'Speedco — Joliet IL' },
  { date: '2023-07-22', type: 'Tire Rotation + Alignment',     mileage: 341000, cost: 890,  shop: 'TA Truck Service' },
  { date: '2023-04-05', type: 'Annual DOT Inspection',         mileage: 318000, cost: 450,  shop: 'Elite Truck Repair' },
  { date: '2022-12-14', type: 'Coolant Flush + Thermostat',    mileage: 294000, cost: 680,  shop: 'Freightliner Chicago' },
  { date: '2022-08-30', type: 'Transmission Service',          mileage: 271000, cost: 1850, shop: 'Summit Truck Group' },
]

const UPCOMING_SERVICES = [
  { service: 'Oil & Filter Change',          due_date: '2024-04-15', due_miles: 395000, est_cost: 285,  priority: 'high' },
  { service: 'ELD Device Recertification',   due_date: '2024-05-01', due_miles: null,   est_cost: 0,    priority: 'medium' },
  { service: 'Drive Tire Replacement',       due_date: '2024-06-01', due_miles: 420000, est_cost: 3200, priority: 'medium' },
]

const COSTS = [
  { label: 'Fuel',               value: 28420 },
  { label: 'Maintenance',        value: 5395  },
  { label: 'Insurance (alloc.)', value: 8400  },
  { label: 'Tolls',              value: 1240  },
]
const TOTAL_COST = COSTS.reduce((s, c) => s + c.value, 0)

const COMPLIANCE_DOCS = [
  { label: 'Commercial Insurance',  expiry: '2024-12-31', issuer: 'Great West Casualty Co.' },
  { label: 'Vehicle Registration',  expiry: '2024-10-31', issuer: 'State of Illinois' },
  { label: 'Annual DOT Inspection', expiry: '2024-11-15', issuer: 'FMCSA Certified Shop' },
  { label: 'IRP Apportioned Plate', expiry: '2024-12-31', issuer: 'Illinois SOS' },
  { label: 'IFTA License',          expiry: '2024-12-31', issuer: 'Illinois Dept. of Revenue' },
  { label: 'Unified Carrier Reg.',  expiry: '2024-12-31', issuer: 'UCR National Registry' },
]

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function VehicleDetailPage() {
  const { id } = useParams()
  const vehicle = MOCK_VEHICLES.find(v => v.id === id) ?? MOCK_VEHICLES[0]

  const now = Date.now()
  const maintenanceSoon = vehicle.next_maintenance_date &&
    new Date(vehicle.next_maintenance_date).getTime() - now < 14 * 86_400_000

  const location = vehicle.last_known_location
    ? `${vehicle.last_known_location.city}, ${vehicle.last_known_location.state}`
    : 'Unknown'

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Header card — identity + stats in one unit */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Top: identity + actions */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/fleet" className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-9 w-px bg-gray-100 dark:bg-zinc-800" />
            <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <Truck className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-bold text-gray-900 dark:text-zinc-50">Unit {vehicle.unit_number}</h1>
                <StatusBadge status={vehicle.status} type="vehicle" />
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.license_plate} · {vehicle.vehicle_type?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-8 px-3.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              Schedule Maintenance
            </button>
            <button className="h-8 px-3.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-zinc-900 text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
              Edit
            </button>
          </div>
        </div>

        {/* Bottom: 4 uniform stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 dark:border-zinc-800 divide-x divide-gray-100 dark:divide-zinc-800">
          {[
            { label: 'Current Mileage',    value: `${vehicle.current_mileage?.toLocaleString()} mi`, sub: `${vehicle.year} ${vehicle.make}` },
            { label: 'YTD Operating Cost', value: formatCurrency(TOTAL_COST),                        sub: '4 cost categories' },
            { label: 'Next Service Due',   value: formatDate(vehicle.next_maintenance_date),          sub: maintenanceSoon ? 'Due soon' : 'Scheduled', alert: !!maintenanceSoon },
            { label: 'Last Location',      value: location,                                           sub: 'Last GPS ping' },
          ].map(({ label, value, sub, alert }) => (
            <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-2">{label}</p>
              <p className={cn('text-sm font-bold tabular-nums', alert ? 'text-amber-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
              <p className={cn('text-xs mt-1.5', alert ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500')}>{sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="overview">
          <TabsList className="mb-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* ── Overview ─────────────────────────────────────────────────── */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-5 gap-4">

              {/* Left — vehicle + operational details */}
              <div className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                {/* Vehicle Info */}
                <div className="px-6 py-5">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Vehicle Info</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      ['VIN',           vehicle.vin],
                      ['Year',          String(vehicle.year)],
                      ['Make',          vehicle.make ?? '—'],
                      ['Model',         vehicle.model ?? '—'],
                      ['Type',          vehicle.vehicle_type?.replace('_', ' ') ?? '—'],
                      ['License Plate', `${vehicle.license_plate} · ${vehicle.license_state}`],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mb-0.5">{k}</p>
                        <p className="text-sm text-gray-800 dark:text-zinc-100 font-medium capitalize tabular-nums">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 px-6 py-5">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Operational Status</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      ['Location',           vehicle.last_known_location
                        ? `${vehicle.last_known_location.city}, ${vehicle.last_known_location.state}`
                        : 'Unknown'],
                      ['Current Mileage',    `${vehicle.current_mileage?.toLocaleString()} mi`],
                      ['Next PM Due',        formatDate(vehicle.next_maintenance_date)],
                      ['Insurance Expiry',   formatDate(vehicle.insurance_expiry)],
                      ['Registration Expiry',formatDate(vehicle.registration_expiry)],
                      ['In Fleet Since',     formatDate(vehicle.created_at)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mb-0.5">{k}</p>
                        <p className="text-sm text-gray-800 dark:text-zinc-100 font-medium tabular-nums">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — YTD cost breakdown */}
              <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-5">YTD Cost Breakdown</p>
                <div className="space-y-4">
                  {COSTS.map(c => (
                    <div key={c.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-600 dark:text-zinc-400">{c.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(c.value)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gray-400 dark:bg-zinc-300"
                          style={{ width: `${(c.value / TOTAL_COST) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">Total YTD</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(TOTAL_COST)}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5">
                    ${(TOTAL_COST / (vehicle.current_mileage ?? 1)).toFixed(2)} per mile
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Maintenance ──────────────────────────────────────────────── */}
          <TabsContent value="maintenance">
            <div className="space-y-4">

              {/* Upcoming */}
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                  <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Upcoming Services</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{UPCOMING_SERVICES.length} items scheduled</p>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                  {UPCOMING_SERVICES.map((svc, i) => (
                    <div key={i} className={cn(
                      'flex items-center gap-5 px-6 py-4',
                      svc.priority === 'high' && 'bg-amber-50/60'
                    )}>
                      <div className={cn(
                        'w-1 self-stretch rounded-full',
                        svc.priority === 'high' ? 'bg-amber-400' : 'bg-gray-200'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">{svc.service}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                          Due {formatDate(svc.due_date)}
                          {svc.due_miles && ` · ${svc.due_miles.toLocaleString()} mi`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
                          {svc.est_cost > 0 ? formatCurrency(svc.est_cost) : '—'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">est.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History */}
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                  <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Service History</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{MAINTENANCE_HISTORY.length} records · {formatCurrency(MAINTENANCE_HISTORY.reduce((s,r)=>s+r.cost,0))} total</p>
                </div>
                <div className="overflow-x-auto"><table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                      {['Service', 'Shop', 'Date', 'Mileage', 'Cost'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                    {MAINTENANCE_HISTORY.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-800 dark:text-zinc-100">{item.type}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400">{item.shop}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{formatDate(item.date)}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{item.mileage.toLocaleString()} mi</td>
                        <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(item.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                      <td colSpan={4} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Total</td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-zinc-50 tabular-nums">
                        {formatCurrency(MAINTENANCE_HISTORY.reduce((s, r) => s + r.cost, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table></div>
              </div>
            </div>
          </TabsContent>

          {/* ── Compliance ───────────────────────────────────────────────── */}
          <TabsContent value="compliance">
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              {/* Summary row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-zinc-800 border-b border-gray-200 dark:border-zinc-800">
                {[
                  { label: 'All Current',    count: COMPLIANCE_DOCS.filter(d => expiryMeta(d.expiry).level === 'ok').length,       color: 'text-green-600' },
                  { label: 'Expiring Soon',  count: COMPLIANCE_DOCS.filter(d => ['warning','critical'].includes(expiryMeta(d.expiry).level)).length, color: 'text-amber-600' },
                  { label: 'Expired',        count: COMPLIANCE_DOCS.filter(d => expiryMeta(d.expiry).level === 'expired').length,   color: 'text-red-500' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <p className="text-xs text-gray-400 dark:text-zinc-500">{label}</p>
                    <p className={cn('text-2xl font-bold tabular-nums mt-1', color)}>{count}</p>
                  </div>
                ))}
              </div>

              {/* Document list */}
              <div className="overflow-x-auto"><table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    {['Document', 'Issuing Authority', 'Expiry Date', 'Days Remaining', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                  {COMPLIANCE_DOCS.map(doc => {
                    const meta = expiryMeta(doc.expiry)
                    return (
                      <tr key={doc.label} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('h-1.5 w-1.5 rounded-full shrink-0',
                              meta.level === 'ok'       ? 'bg-green-500' :
                              meta.level === 'warning'  ? 'bg-amber-400' :
                              meta.level === 'critical' ? 'bg-red-400' :
                                                          'bg-red-600'
                            )} />
                            <span className="text-sm font-medium text-gray-800 dark:text-zinc-100">{doc.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">{doc.issuer}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">{formatDate(doc.expiry)}</td>
                        <td className="px-6 py-4 text-sm tabular-nums">
                          <span className={cn(
                            meta.level === 'ok'       ? 'text-gray-600 dark:text-zinc-400' :
                            meta.level === 'warning'  ? 'text-amber-600' :
                                                        'text-red-500'
                          )}>
                            {meta.days !== null && meta.days >= 0 ? `${meta.days}d` : meta.days !== null ? 'Overdue' : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {meta.level === 'ok' ? (
                            <div className="flex items-center gap-1.5 text-xs text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Valid
                            </div>
                          ) : (
                            <div className={cn('flex items-center gap-1.5 text-xs',
                              meta.level === 'expired' ? 'text-red-500' : 'text-amber-600'
                            )}>
                              <AlertTriangle className="h-3.5 w-3.5" />
                              {meta.level === 'expired' ? 'Expired' : 'Expiring Soon'}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table></div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
