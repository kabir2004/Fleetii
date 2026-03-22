import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const EXPIRING_DOCS = [
  { entity: 'Sandra Chen',           type: 'CDL',                   expiry: 'Dec 1, 2025',  daysLeft: 255, category: 'Driver'   },
  { entity: 'Sandra Chen',           type: 'Medical Certificate',    expiry: 'Jun 30, 2025', daysLeft: 101, category: 'Driver'   },
  { entity: 'T-103 (Peterbilt 579)', type: 'Annual DOT Inspection',  expiry: 'Nov 15, 2025', daysLeft: 239, category: 'Vehicle'  },
  { entity: 'Marcus Williams',       type: 'Medical Certificate',    expiry: 'Sep 18, 2025', daysLeft: 181, category: 'Driver'   },
  { entity: 'T-105 (Kenworth T680)', type: 'Commercial Registration',expiry: 'Oct 31, 2025', daysLeft: 224, category: 'Vehicle'  },
  { entity: 'Northbound Freight LLC',type: 'Certificate of Insurance',expiry: 'Jan 1, 2025', daysLeft: -79, category: 'Company'  },
]

function statusConfig(daysLeft: number) {
  if (daysLeft < 0)  return { label: 'Overdue',      dot: 'bg-red-500',   text: 'text-red-600',   badge: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',   icon: XCircle      }
  if (daysLeft <= 30) return { label: 'Critical',     dot: 'bg-red-400',   text: 'text-red-500',   badge: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',   icon: AlertTriangle }
  if (daysLeft <= 90) return { label: 'Expiring Soon',dot: 'bg-amber-400', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900', icon: Clock    }
  return              { label: 'Valid',               dot: 'bg-green-500', text: 'text-green-600', badge: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900',  icon: CheckCircle2 }
}

const allClear    = EXPIRING_DOCS.filter(d => d.daysLeft > 90).length
const expiringSoon= EXPIRING_DOCS.filter(d => d.daysLeft > 30 && d.daysLeft <= 90).length
const critical    = EXPIRING_DOCS.filter(d => d.daysLeft > 0 && d.daysLeft <= 30).length
const overdue     = EXPIRING_DOCS.filter(d => d.daysLeft < 0).length

export default function ComplianceDashboard() {
  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Valid Documents',  value: String(allClear),     sub: 'No action needed',    icon: CheckCircle2, alert: false },
          { label: 'Expiring (90 d)', value: String(expiringSoon), sub: 'Renew proactively',    icon: Clock,        alert: expiringSoon > 0 },
          { label: 'Critical (30 d)', value: String(critical),     sub: 'Renew immediately',    icon: AlertTriangle,alert: critical > 0 },
          { label: 'Overdue',          value: String(overdue),      sub: 'Past expiration date', icon: Shield,       alert: overdue > 0 },
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

      {/* Expirations table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Document Expiration Tracker</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">All compliance documents · Sorted by urgency</p>
          </div>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{EXPIRING_DOCS.length} documents</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Status', 'Document', 'Type', 'Entity', 'Category', 'Expiry Date', 'Days Remaining'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {[...EXPIRING_DOCS].sort((a, b) => a.daysLeft - b.daysLeft).map((doc, i) => {
              const s = statusConfig(doc.daysLeft)
              const StatusIcon = s.icon
              return (
                <motion.tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', s.dot)} />
                      <StatusIcon className={cn('h-3.5 w-3.5', s.text)} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">{doc.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', s.badge)}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">{doc.entity}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-zinc-400">{doc.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">{doc.expiry}</td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-semibold tabular-nums', s.text)}>
                      {doc.daysLeft < 0 ? `${Math.abs(doc.daysLeft)}d overdue` : `${doc.daysLeft}d`}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table></div>
      </motion.div>

    </div>
  )
}
