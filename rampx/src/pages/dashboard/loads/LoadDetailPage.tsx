import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Truck, User, Calendar, Package,
  DollarSign, FileText, CheckCircle2, Clock, Upload,
  AlertCircle, TrendingUp, Route,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate, formatDateTime, formatMiles, formatWeight, formatPercent } from '@/lib/formatters'
import { MOCK_LOADS, MOCK_DRIVERS, MOCK_VEHICLES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const TIMELINE_EVENTS = [
  { status: 'created',     label: 'Load Created',         time: '2024-03-18T10:00:00Z', done: true,  note: 'Created by Alex Morgan' },
  { status: 'dispatched',  label: 'Dispatched to Driver', time: '2024-03-18T14:30:00Z', done: true,  note: 'Marcus Williams accepted' },
  { status: 'at_pickup',   label: 'Arrived at Pickup',    time: '2024-03-20T07:45:00Z', done: true,  note: 'On time' },
  { status: 'picked_up',   label: 'Freight Picked Up',    time: '2024-03-20T09:15:00Z', done: true,  note: 'BOL signed' },
  { status: 'in_transit',  label: 'In Transit',           time: '2024-03-20T09:20:00Z', done: true,  note: 'En route to destination' },
  { status: 'at_delivery', label: 'Arrived at Delivery',  time: null,                   done: false, note: null },
  { status: 'delivered',   label: 'Delivered',            time: null,                   done: false, note: null },
]

const DOCUMENTS = [
  { type: 'BOL', label: 'Bill of Lading',    required: true,  uploaded: true,  date: '2024-03-20', size: '284 KB' },
  { type: 'POD', label: 'Proof of Delivery', required: true,  uploaded: false, date: null,         size: null },
  { type: 'RC',  label: 'Rate Confirmation', required: true,  uploaded: true,  date: '2024-03-18', size: '128 KB' },
]

function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-zinc-800/50 last:border-0">
      <span className="text-sm text-gray-400 dark:text-zinc-500">{label}</span>
      <span className={cn('text-sm text-gray-900 dark:text-zinc-50 font-medium', mono && 'tabular-nums')}>{value}</span>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-gray-500 dark:text-zinc-400" />
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{title}</p>
      </div>
      {children}
    </div>
  )
}

export default function LoadDetailPage() {
  const { id } = useParams()
  const load = MOCK_LOADS.find(l => l.id === id) ?? MOCK_LOADS[0]
  const driver = MOCK_DRIVERS.find(d => d.id === load.driver_id)
  const vehicle = MOCK_VEHICLES.find(v => v.id === load.vehicle_id)

  const margin = load.margin ?? 0
  const marginPct = load.margin_percentage ?? 0
  const totalRevenue = load.total_revenue ?? load.customer_rate ?? 0
  const totalCost = load.total_cost ?? 0
  const marginBarWidth = Math.min(Math.max(marginPct, 0), 100)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Header */}
      <div>
        <Link to="/dashboard/loads" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Loads
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-50">{load.load_number}</h1>
            <StatusBadge status={load.status} type="load" />
            {load.hazmat && (
              <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-100 rounded-md px-2 py-0.5">
                HAZMAT
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="h-8 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 text-sm text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              Edit
            </button>
            <button className="h-8 px-3 rounded-lg bg-gray-900 text-sm text-white hover:bg-gray-700 transition-colors">
              Update Status
            </button>
          </div>
        </div>
        {load.reference_number && (
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Ref: {load.reference_number}</p>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Revenue',    value: formatCurrency(totalRevenue, true),             sub: formatCurrency(totalRevenue),       icon: DollarSign },
          { label: 'Net Margin', value: `${marginPct.toFixed(1)}%`,                    sub: formatCurrency(margin),              icon: TrendingUp, green: marginPct >= 20 },
          { label: 'Distance',   value: formatMiles(load.miles),                        sub: `$${load.rate_per_mile?.toFixed(2) ?? '—'}/mi`, icon: Route },
          { label: 'Driver',     value: driver ? `${driver.first_name} ${driver.last_name}` : 'Unassigned', sub: vehicle?.unit_number ?? 'No vehicle', icon: User },
        ].map(({ label, value, sub, icon: Icon, green }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 dark:text-zinc-500">{label}</p>
              <div className="h-7 w-7 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
              </div>
            </div>
            <p className={cn('text-xl font-bold tabular-nums', green ? 'text-green-600' : 'text-gray-900 dark:text-zinc-50')}>{value}</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>

            <SectionCard title="Origin" icon={MapPin}>
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">{load.shipper_name}</p>
              {load.shipper_address && (
                <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3 leading-relaxed">
                  {load.shipper_address.street}<br />
                  {load.shipper_address.city}, {load.shipper_address.state} {load.shipper_address.zip}
                </p>
              )}
              <InfoRow label="Scheduled Pickup" value={formatDateTime(load.pickup_date)} />
              {load.actual_pickup && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Picked up {formatDateTime(load.actual_pickup)}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Destination" icon={MapPin}>
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">{load.consignee_name}</p>
              {load.consignee_address && (
                <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3 leading-relaxed">
                  {load.consignee_address.street}<br />
                  {load.consignee_address.city}, {load.consignee_address.state} {load.consignee_address.zip}
                </p>
              )}
              <InfoRow label="Scheduled Delivery" value={formatDateTime(load.delivery_date)} />
              {load.actual_delivery ? (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Delivered {formatDateTime(load.actual_delivery)}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                  <Clock className="h-3.5 w-3.5" />
                  Awaiting delivery
                </div>
              )}
            </SectionCard>

            <SectionCard title="Cargo" icon={Package}>
              <InfoRow label="Commodity"  value={load.commodity ?? '—'} />
              <InfoRow label="Weight"     value={formatWeight(load.weight_lbs)} mono />
              <InfoRow label="Pieces"     value={load.pieces ?? '—'} mono />
              <InfoRow label="Equipment"  value={load.equipment_type?.replace('_', ' ') ?? '—'} />
              <InfoRow label="Distance"   value={formatMiles(load.miles)} mono />
              {load.temperature_min !== undefined && (
                <InfoRow label="Temp Range" value={`${load.temperature_min}°F – ${load.temperature_max}°F`} mono />
              )}
            </SectionCard>

            <SectionCard title="Driver" icon={User}>
              {driver ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-1">{driver.first_name} {driver.last_name}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">{driver.phone}</p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={driver.status} type="driver" />
                    <span className="text-xs text-gray-400 dark:text-zinc-500">CDL Class {driver.cdl_class}</span>
                  </div>
                  <InfoRow label="Safety Score" value={`${driver.safety_score}/10`} mono />
                  <InfoRow label="YTD Miles"    value={driver.ytd_miles?.toLocaleString() ?? '—'} mono />
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  No driver assigned
                </div>
              )}
            </SectionCard>

            <SectionCard title="Vehicle" icon={Truck}>
              {vehicle ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">{vehicle.unit_number}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <StatusBadge status={vehicle.status} type="vehicle" />
                  <InfoRow label="License Plate" value={vehicle.license_plate ?? '—'} />
                  <InfoRow label="VIN" value={vehicle.vin?.slice(-8) ?? '—'} mono />
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  No vehicle assigned
                </div>
              )}
            </SectionCard>

            <SectionCard title="Quick Financials" icon={DollarSign}>
              <InfoRow label="Customer Rate"  value={formatCurrency(load.customer_rate)} mono />
              <InfoRow label="Driver Pay"     value={formatCurrency(load.driver_pay)} mono />
              <InfoRow label="Fuel Surcharge" value={formatCurrency(load.fuel_surcharge)} mono />
              <div className="border-t border-gray-100 dark:border-zinc-800/50 mt-1 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Net Margin</span>
                  <span className={cn('text-sm font-bold tabular-nums', marginPct >= 20 ? 'text-green-600' : 'text-amber-600')}>
                    {formatCurrency(margin)} · {formatPercent(marginPct)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', marginPct >= 20 ? 'bg-green-500' : 'bg-amber-400')}
                    style={{ width: `${marginBarWidth}%` }}
                  />
                </div>
              </div>
            </SectionCard>
          </motion.div>
        </TabsContent>

        {/* TIMELINE */}
        <TabsContent value="timeline">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10">
              <div className="flex items-start w-full">
                {TIMELINE_EVENTS.map((event, i) => {
                  const isLast = i === TIMELINE_EVENTS.length - 1
                  const isCurrent = !event.done && (i === 0 || TIMELINE_EVENTS[i - 1].done)
                  return (
                    <div key={event.status} className="flex-1 flex flex-col items-center relative">
                      {/* Left connector */}
                      {i > 0 && (
                        <div className={cn(
                          'absolute top-3.5 right-1/2 left-0 h-0.5',
                          TIMELINE_EVENTS[i - 1].done ? 'bg-gray-900 dark:bg-zinc-50' : 'bg-gray-200 dark:bg-zinc-700'
                        )} />
                      )}
                      {/* Right connector */}
                      {!isLast && (
                        <div className={cn(
                          'absolute top-3.5 left-1/2 right-0 h-0.5',
                          event.done ? 'bg-gray-900 dark:bg-zinc-50' : 'bg-gray-200 dark:bg-zinc-700'
                        )} />
                      )}

                      {/* Dot */}
                      <div className="relative z-10 mb-5">
                        {event.done ? (
                          <div className="h-7 w-7 rounded-full bg-gray-900 dark:bg-zinc-50 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white dark:text-zinc-900" />
                          </div>
                        ) : isCurrent ? (
                          <div className="h-7 w-7 rounded-full border-2 border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                            <div className="h-2.5 w-2.5 rounded-full bg-gray-900 dark:bg-zinc-50" />
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-full border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 ring-4 ring-white dark:ring-zinc-900" />
                        )}
                      </div>

                      {/* Label */}
                      <p className={cn(
                        'text-xs font-semibold text-center px-2 leading-snug mb-1',
                        event.done ? 'text-gray-900 dark:text-zinc-50' : isCurrent ? 'text-gray-800 dark:text-zinc-100' : 'text-gray-400 dark:text-zinc-500'
                      )}>
                        {event.label}
                      </p>

                      {/* Time */}
                      <p className="text-[11px] text-gray-400 dark:text-zinc-500 text-center tabular-nums px-2">
                        {event.time ? formatDate(event.time, 'MMM d, h:mm a') : 'Pending'}
                      </p>

                      {/* Note */}
                      {event.note && event.done && (
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 text-center mt-1.5 px-2 leading-snug">{event.note}</p>
                      )}

                      {/* Active badge */}
                      {isCurrent && (
                        <span className="mt-2 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                          Active
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Status Updates Feed */}
            <div className="mt-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Status Updates</p>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                {[
                  {
                    time: '2024-03-20T09:20:00Z',
                    title: 'Load is in transit',
                    body: 'Marcus Williams departed the pickup location in Chicago, IL and is now en route to Dallas, TX. Estimated arrival in approximately 14 hours.',
                    type: 'transit',
                  },
                  {
                    time: '2024-03-20T09:15:00Z',
                    title: 'Freight picked up — BOL signed',
                    body: 'Driver confirmed pickup at Midwest Distribution Center. Bill of lading signed and uploaded. All 42,000 lbs accounted for, no exceptions noted.',
                    type: 'pickup',
                  },
                  {
                    time: '2024-03-20T07:45:00Z',
                    title: 'Driver arrived at pickup',
                    body: 'Marcus Williams checked in at the shipper location. Dock assignment pending. No delays reported at this time.',
                    type: 'arrival',
                  },
                  {
                    time: '2024-03-18T14:30:00Z',
                    title: 'Load dispatched to driver',
                    body: 'Load NBF-2024-0842 was dispatched to Marcus Williams. Driver accepted the load and confirmed availability for the scheduled pickup on March 20.',
                    type: 'dispatch',
                  },
                  {
                    time: '2024-03-18T10:00:00Z',
                    title: 'Load created',
                    body: 'Load created by Alex Morgan for Southeast Auto Dealers Assoc. Rate confirmation sent to carrier. Pickup window: March 20, 7:00 AM – 10:00 AM.',
                    type: 'created',
                  },
                ].map((update, i) => (
                  <div key={i} className="flex gap-4 px-6 py-4">
                    <div className="shrink-0 mt-0.5">
                      <div className={cn(
                        'h-2 w-2 rounded-full mt-1.5',
                        update.type === 'transit' ? 'bg-indigo-500' :
                        update.type === 'pickup'  ? 'bg-green-500' :
                        update.type === 'arrival' ? 'bg-blue-400' :
                        'bg-gray-300 dark:bg-zinc-600'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">{update.title}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums shrink-0">{formatDateTime(update.time)}</p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">{update.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* DOCUMENTS */}
        <TabsContent value="documents">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                {DOCUMENTS.filter(d => d.uploaded).length} of {DOCUMENTS.length} required documents uploaded
              </p>
              {DOCUMENTS.some(d => !d.uploaded) && (
                <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {DOCUMENTS.filter(d => !d.uploaded).length} missing
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {DOCUMENTS.map(doc => (
                <div key={doc.type} className={cn(
                  'rounded-xl border bg-white dark:bg-zinc-900 p-5',
                  !doc.uploaded && doc.required ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 dark:border-zinc-800'
                )}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                      <FileText className={cn('h-5 w-5', doc.uploaded ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-300 dark:text-zinc-600')} />
                    </div>
                    {doc.required && !doc.uploaded ? (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">
                        Required · Missing
                      </span>
                    ) : doc.uploaded ? (
                      <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-md px-2 py-0.5">
                        Uploaded
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">{doc.type}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-3">{doc.label}</p>

                  {doc.uploaded ? (
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
                        <span>Uploaded {formatDate(doc.date!)}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mb-4">Not yet uploaded</p>
                  )}

                  <button className={cn(
                    'w-full h-8 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors',
                    doc.uploaded
                      ? 'border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                  )}>
                    {doc.uploaded ? (
                      <><FileText className="h-3.5 w-3.5" /> View Document</>
                    ) : (
                      <><Upload className="h-3.5 w-3.5" /> Upload Now</>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">

              {/* Invoice Readiness */}
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/50">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Invoice Readiness</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Documents required to submit invoice for payment</p>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {[
                    { label: 'Rate Confirmation', done: true,  note: 'Signed by shipper' },
                    { label: 'Bill of Lading',    done: true,  note: 'Uploaded Mar 20' },
                    { label: 'Proof of Delivery', done: false, note: 'Required before invoicing' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {item.done ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">{item.label}</p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">{item.note}</p>
                        </div>
                      </div>
                      {item.done ? (
                        <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-md px-2 py-0.5 font-medium">Ready</span>
                      ) : (
                        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5 font-medium">Blocking</span>
                      )}
                    </div>
                  ))}
                  <div className="px-5 py-3.5 bg-amber-50/50">
                    <p className="text-xs text-amber-700 font-medium">POD required before invoice can be submitted. Upload to unblock payment.</p>
                  </div>
                </div>
              </div>

              {/* Document Activity */}
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/50">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Activity Log</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Document history for this load</p>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {[
                    { time: 'Mar 20, 9:18 AM', action: 'BOL uploaded',             user: 'Marcus Williams',  type: 'upload' },
                    { time: 'Mar 20, 9:15 AM', action: 'BOL requested from driver', user: 'Alex Morgan',      type: 'request' },
                    { time: 'Mar 18, 2:31 PM', action: 'Rate confirmation sent',    user: 'Alex Morgan',      type: 'send' },
                    { time: 'Mar 18, 2:30 PM', action: 'RC uploaded',              user: 'Alex Morgan',      type: 'upload' },
                    { time: 'Mar 18, 10:00 AM', action: 'Load created',             user: 'Alex Morgan',      type: 'create' },
                  ].map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <div className={cn(
                        'h-1.5 w-1.5 rounded-full shrink-0',
                        entry.type === 'upload'  ? 'bg-green-500' :
                        entry.type === 'request' ? 'bg-amber-400' :
                        entry.type === 'send'    ? 'bg-blue-400' :
                        'bg-gray-300 dark:bg-zinc-600'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-zinc-300">{entry.action} <span className="text-gray-400 dark:text-zinc-500">by {entry.user}</span></p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums shrink-0">{entry.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* FINANCIALS */}
        <TabsContent value="financials">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* P&L Statement */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-5">Profit and Loss</p>

              {/* Revenue */}
              <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-2">Revenue</p>
              <div className="space-y-0 mb-4">
                {[
                  { label: 'Base freight charge',  value: load.customer_rate },
                  { label: 'Fuel surcharge',       value: load.fuel_surcharge },
                  { label: 'Accessorial charges',  value: load.accessorial_charges },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-zinc-800/50">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">{row.label}</span>
                    <span className="text-sm tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(row.value)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-2.5 mb-5">
                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Total Revenue</span>
                <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(totalRevenue)}</span>
              </div>

              {/* Costs */}
              <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-2">Costs</p>
              <div className="space-y-0 mb-4">
                {[
                  { label: 'Driver pay',    value: load.driver_pay },
                  { label: 'Fuel estimate', value: (load.miles ?? 0) * 0.5 },
                  { label: 'Tolls',         value: null },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-zinc-800/50">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">{row.label}</span>
                    <span className="text-sm tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(row.value!)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-2.5 mb-5">
                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Total Cost</span>
                <span className="text-sm font-bold tabular-nums text-red-500">{formatCurrency(totalCost)}</span>
              </div>

              {/* Net */}
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-gray-900 dark:text-zinc-50">Net Margin</span>
                  <div className="text-right">
                    <span className={cn('text-xl font-bold tabular-nums', marginPct >= 20 ? 'text-green-600' : 'text-amber-600')}>
                      {formatCurrency(margin)}
                    </span>
                    <span className={cn('text-sm ml-1.5', marginPct >= 20 ? 'text-green-600' : 'text-amber-600')}>
                      ({marginPct.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', marginPct >= 20 ? 'bg-green-500' : 'bg-amber-400')}
                    style={{ width: `${marginBarWidth}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5">
                  {marginPct >= 25 ? 'Above target' : marginPct >= 15 ? 'At target' : 'Below target'} · Fleet avg 22.4%
                </p>
              </div>
            </div>

            {/* Rate metrics */}
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-4">Rate Breakdown</p>
                <div className="space-y-0">
                  <InfoRow label="Rate per mile"     value={`$${load.rate_per_mile?.toFixed(2) ?? '—'}/mi`} mono />
                  <InfoRow label="Cost per mile"     value={`$${totalCost && load.miles ? (totalCost / load.miles).toFixed(2) : '—'}/mi`} mono />
                  <InfoRow label="Revenue per mile"  value={`$${totalRevenue && load.miles ? (totalRevenue / load.miles).toFixed(2) : '—'}/mi`} mono />
                  <InfoRow label="Distance"          value={formatMiles(load.miles)} mono />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-4">Payment Status</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">Invoice Status</span>
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">Pending</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">Amount Due</span>
                    <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">Due Date</span>
                    <span className="text-sm text-gray-900 dark:text-zinc-50">{formatDate(load.delivery_date, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
