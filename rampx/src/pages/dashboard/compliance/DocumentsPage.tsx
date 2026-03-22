import { motion } from 'framer-motion'
import { Upload, FileText, Download, Files, ShieldCheck, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const DOCUMENTS = [
  { id: 1, name: 'Certificate of Insurance 2024',    type: 'insurance',  entity: 'Northbound Freight LLC',  date: 'Jan 1, 2024',  size: '284 KB' },
  { id: 2, name: 'BOL — NBF-2024-0842',              type: 'bol',        entity: 'Load NBF-2024-0842',      date: 'Mar 20, 2024', size: '128 KB' },
  { id: 3, name: 'POD — NBF-2024-0841',              type: 'pod',        entity: 'Load NBF-2024-0841',      date: 'Mar 20, 2024', size: '95 KB'  },
  { id: 4, name: 'Rate Confirmation — FastRoute',    type: 'rate_conf',  entity: 'FastRoute Carrier',       date: 'Mar 18, 2024', size: '64 KB'  },
  { id: 5, name: 'Marcus Williams CDL',               type: 'compliance', entity: 'Marcus Williams',         date: 'Jan 10, 2024', size: '210 KB' },
  { id: 6, name: 'Sandra Chen Medical Card',          type: 'compliance', entity: 'Sandra Chen',             date: 'Nov 20, 2023', size: '175 KB' },
  { id: 7, name: 'BOL — NBF-2024-0839',              type: 'bol',        entity: 'Load NBF-2024-0839',      date: 'Mar 15, 2024', size: '112 KB' },
  { id: 8, name: 'POD — NBF-2024-0837',              type: 'pod',        entity: 'Load NBF-2024-0837',      date: 'Mar 14, 2024', size: '88 KB'  },
  { id: 9, name: 'Annual DOT Inspection — T-101',    type: 'compliance', entity: 'Unit T-101',              date: 'Feb 28, 2024', size: '320 KB' },
  { id: 10, name: 'Rate Confirmation — Midwest Frt', type: 'rate_conf',  entity: 'Midwest Freight Express', date: 'Mar 10, 2024', size: '58 KB'  },
]

const TYPE_CONFIG: Record<string, { label: string; badge: string }> = {
  bol:        { label: 'BOL',        badge: 'bg-blue-50 text-blue-700 border-blue-100'   },
  pod:        { label: 'POD',        badge: 'bg-purple-50 text-purple-700 border-purple-100' },
  rate_conf:  { label: 'Rate Conf',  badge: 'bg-gray-50 text-gray-600 border-gray-200'   },
  compliance: { label: 'Compliance', badge: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900' },
  insurance:  { label: 'Insurance',  badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900' },
}

const FILTERS = ['All', 'BOL', 'POD', 'Rate Conf', 'Compliance', 'Insurance'] as const
type Filter = typeof FILTERS[number]

const typeKey = (f: Filter): string | null => {
  if (f === 'All')        return null
  if (f === 'BOL')        return 'bol'
  if (f === 'POD')        return 'pod'
  if (f === 'Rate Conf')  return 'rate_conf'
  if (f === 'Compliance') return 'compliance'
  if (f === 'Insurance')  return 'insurance'
  return null
}

const bols       = DOCUMENTS.filter(d => d.type === 'bol').length
const pods       = DOCUMENTS.filter(d => d.type === 'pod').length
const compliance = DOCUMENTS.filter(d => d.type === 'compliance').length

export default function DocumentsPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const key = typeKey(filter)
  const docs = key ? DOCUMENTS.filter(d => d.type === key) : DOCUMENTS

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Total Documents',   value: String(DOCUMENTS.length), sub: 'All document types',      icon: Files       },
          { label: 'BOLs & PODs',       value: String(bols + pods),      sub: `${bols} BOLs · ${pods} PODs`, icon: FileText },
          { label: 'Compliance Docs',   value: String(compliance),       sub: 'Licenses, inspections',  icon: ShieldCheck },
          { label: 'Recent Uploads',    value: '4',                      sub: 'Last 7 days',            icon: ClipboardList },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums tracking-tight">{value}</p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                filter === f ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-50 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
          <Upload className="h-3.5 w-3.5" />
          Upload Document
        </button>
      </motion.div>

      {/* Documents table */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">All Documents</p>
          <span className="text-xs text-gray-400 dark:text-zinc-500">{docs.length} files</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {['Name', 'Type', 'Entity', 'Upload Date', 'Size', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {docs.map((doc, i) => {
              const cfg = TYPE_CONFIG[doc.type]
              return (
                <motion.tr
                  key={doc.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <FileText className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">{doc.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', cfg.badge)}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-zinc-400">{doc.entity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{doc.date}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="h-7 px-2.5 rounded-md border border-gray-200 dark:border-zinc-700 text-xs text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 ml-auto">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
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
