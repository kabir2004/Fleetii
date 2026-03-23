import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, formatCurrency, getInitials, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_DRIVERS, MOCK_LOADS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

function expiryMeta(dateStr: string | undefined) {
  if (!dateStr) return { days: null, level: 'ok' as const }
  const days = Math.floor((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
  if (days < 0)   return { days, level: 'expired' as const }
  if (days < 30)  return { days, level: 'critical' as const }
  if (days < 90)  return { days, level: 'warning' as const }
  return { days, level: 'ok' as const }
}

function safetyColor(score: number) {
  if (score >= 9) return 'text-green-600'
  if (score >= 7) return 'text-amber-600'
  return 'text-red-500'
}

export default function DriverDetailPage() {
  const { id } = useParams()
  const driver = MOCK_DRIVERS.find(d => d.id === id) ?? MOCK_DRIVERS[0]
  const driverLoads = MOCK_LOADS.filter(l => l.driver_id === driver.id)

  const score = driver.safety_score ?? 0
  const initials = getInitials(driver.first_name, driver.last_name)

  const COMPLIANCE_DOCS = [
    { label: 'CDL License',          date: driver.cdl_expiry,          isLast: false },
    { label: 'Medical Certificate',  date: driver.medical_card_expiry,  isLast: false },
    { label: 'Drug Test (last)',      date: driver.drug_test_date,       isLast: true  },
  ]

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Unified header + stats card */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Identity row */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard/drivers"
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-9 w-px bg-gray-100 dark:bg-zinc-800" />
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-bold text-gray-900 dark:text-zinc-50">{driver.first_name} {driver.last_name}</h1>
                <StatusBadge status={driver.status} type="driver" />
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                CDL Class {driver.cdl_class} · {driver.cdl_state} · Hired {formatDate(driver.hire_date)}
              </p>
            </div>
          </div>
          <button className="h-8 px-3.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            Edit Driver
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 dark:border-zinc-800 divide-x divide-gray-100 dark:divide-zinc-800">
          {[
            { label: 'YTD Miles',        value: `${driver.ytd_miles?.toLocaleString() ?? '—'} mi`, sub: 'Year to date' },
            { label: 'YTD Earnings',     value: formatCurrency(driver.ytd_earnings ?? 0),           sub: `$${driver.pay_rate?.toFixed(2)}/mi` },
            { label: 'Loads This Month', value: String(driverLoads.length),                         sub: CURRENT_MONTH_LABEL },
            { label: 'Safety Score',     value: `${score.toFixed(1)}/10`,                           sub: score >= 9 ? 'Excellent' : score >= 7 ? 'Good' : 'Needs review', scoreColor: safetyColor(score) },
          ].map(({ label, value, sub, scoreColor }) => (
            <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-2">{label}</p>
              <p className={cn('text-sm font-bold tabular-nums', scoreColor ?? 'text-gray-900 dark:text-zinc-50')}>{value}</p>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
        <Tabs defaultValue="info">
          <TabsList className="mb-5">
            <TabsTrigger value="info">Driver Info</TabsTrigger>
            <TabsTrigger value="loads">Load History</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* ── Driver Info ───────────────────────────────────────────────── */}
          <TabsContent value="info">
            <div className="grid lg:grid-cols-5 gap-4">

              {/* Left — contact + personal */}
              <div className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="px-6 py-5">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Contact & Personal</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      ['Phone',     driver.phone],
                      ['Email',     driver.email ?? '—'],
                      ['Home Base', driver.home_base ?? '—'],
                      ['Hired',     formatDate(driver.hire_date)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mb-0.5">{k}</p>
                        <p className="text-sm text-gray-800 dark:text-zinc-100 font-medium">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 px-6 py-5">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">License Details</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      ['CDL Number', driver.cdl_number ?? '—'],
                      ['CDL State',  driver.cdl_state ?? '—'],
                      ['CDL Class',  `Class ${driver.cdl_class}`],
                      ['CDL Expiry', formatDate(driver.cdl_expiry)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mb-0.5">{k}</p>
                        <p className="text-sm text-gray-800 dark:text-zinc-100 font-medium tabular-nums">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — pay + performance */}
              <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-5">Pay & Performance</p>

                <div className="space-y-4">
                  {[
                    ['Pay Type',    driver.pay_type?.replace('_', ' ') ?? '—'],
                    ['Pay Rate',    `$${driver.pay_rate?.toFixed(2)}/mi`],
                    ['YTD Miles',   `${driver.ytd_miles?.toLocaleString() ?? '—'} mi`],
                    ['YTD Earnings', formatCurrency(driver.ytd_earnings ?? 0)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-zinc-400">{k}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums capitalize">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Safety Score</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={cn('text-3xl font-bold tabular-nums', safetyColor(score))}>{score.toFixed(1)}</span>
                    <span className="text-sm text-gray-300 dark:text-zinc-600">/10</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', score >= 9 ? 'bg-green-500' : score >= 7 ? 'bg-amber-400' : 'bg-red-500')}
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2">
                    {score >= 9 ? 'Excellent — top performer' : score >= 7 ? 'Good standing' : 'Needs review'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Load History ──────────────────────────────────────────────── */}
          <TabsContent value="loads">
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Load History</p>
                <span className="text-xs text-gray-400 dark:text-zinc-500">{driverLoads.length} loads</span>
              </div>
              {driverLoads.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-12">No loads found for this driver</p>
              ) : (
                <div className="overflow-x-auto"><table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                      {['Load #', 'Route', 'Status', 'Pickup Date', 'Driver Pay'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                    {driverLoads.map(load => (
                      <tr key={load.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-3.5 text-sm font-bold text-gray-900 dark:text-zinc-50">{load.load_number}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400">
                          {load.shipper_address?.city} → {load.consignee_address?.city}
                        </td>
                        <td className="px-6 py-3.5"><StatusBadge status={load.status} type="load" /></td>
                        <td className="px-6 py-3.5 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{formatDate(load.pickup_date)}</td>
                        <td className="px-6 py-3.5 text-sm font-semibold text-green-600 tabular-nums">
                          {formatCurrency(load.driver_pay)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              )}
            </div>
          </TabsContent>

          {/* ── Compliance ───────────────────────────────────────────────── */}
          <TabsContent value="compliance">
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Driver Compliance</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{COMPLIANCE_DOCS.length} documents tracked</p>
              </div>
              <div className="overflow-x-auto"><table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    {['Document', 'Date', 'Days Remaining', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                  {COMPLIANCE_DOCS.map(doc => {
                    const meta = expiryMeta(doc.date)
                    return (
                      <tr key={doc.label} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('h-1.5 w-1.5 rounded-full shrink-0',
                              doc.isLast               ? 'bg-gray-300' :
                              meta.level === 'ok'      ? 'bg-green-500' :
                              meta.level === 'warning' ? 'bg-amber-400' :
                                                         'bg-red-500'
                            )} />
                            <span className="text-sm font-medium text-gray-800 dark:text-zinc-100">{doc.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-300 tabular-nums">
                          {doc.isLast ? `Last: ${formatDate(doc.date)}` : formatDate(doc.date)}
                        </td>
                        <td className="px-6 py-4 text-sm tabular-nums">
                          {doc.isLast ? (
                            <span className="text-gray-400 dark:text-zinc-500">—</span>
                          ) : (
                            <span className={cn(
                              meta.level === 'ok'      ? 'text-gray-600 dark:text-zinc-400' :
                              meta.level === 'warning' ? 'text-amber-600' :
                                                         'text-red-500'
                            )}>
                              {meta.days !== null && meta.days >= 0 ? `${meta.days}d` : 'Overdue'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {doc.isLast ? (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              On file
                            </div>
                          ) : meta.level === 'ok' ? (
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
