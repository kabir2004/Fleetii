import { motion } from 'framer-motion'
import { Store, Search, Plus, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react'

const STAGGER = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

const VENDORS = [
  { id: 1, name: 'Pilot Flying J',         category: 'Fuel',          ytd: '$148,200', invoices: 94,  trend: 'up',   last: 'Mar 18, 2024' },
  { id: 2, name: 'Love\'s Travel Stops',   category: 'Fuel',          ytd: '$92,400',  invoices: 61,  trend: 'down', last: 'Mar 20, 2024' },
  { id: 3, name: 'Michelin Commercial',    category: 'Maintenance',   ytd: '$38,750',  invoices: 12,  trend: 'up',   last: 'Mar 15, 2024' },
  { id: 4, name: 'Freightliner of Chicago',category: 'Repairs',       ytd: '$27,100',  invoices: 8,   trend: 'up',   last: 'Mar 10, 2024' },
  { id: 5, name: 'OOIDA Insurance Group',  category: 'Insurance',     ytd: '$24,600',  invoices: 12,  trend: 'flat', last: 'Mar 1, 2024'  },
  { id: 6, name: 'Flying Diesel Repair',   category: 'Repairs',       ytd: '$19,350',  invoices: 7,   trend: 'down', last: 'Feb 28, 2024' },
  { id: 7, name: 'Comdata Network',        category: 'Fleet Cards',   ytd: '$11,200',  invoices: 3,   trend: 'flat', last: 'Mar 5, 2024'  },
  { id: 8, name: 'TruckPark Solutions',    category: 'Parking/Tolls', ytd: '$8,900',   invoices: 44,  trend: 'up',   last: 'Mar 21, 2024' },
]

const STATS = [
  { label: 'Active Vendors',  value: '8',       sub: 'this quarter'       },
  { label: 'Total YTD Spend', value: '$370,500', sub: '+12% vs last year'  },
  { label: 'Avg per Vendor',  value: '$46,313',  sub: 'year to date'       },
  { label: 'Pending Invoices',value: '14',       sub: 'awaiting payment'   },
]

export default function VendorsPage() {
  return (
    <div className="p-4 md:p-6 w-full">
      <motion.div
        variants={STAGGER.container}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={STAGGER.item} className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Spend Management</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Vendors</h1>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors">
            <Plus className="h-4 w-4" />
            Add Vendor
          </button>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          variants={STAGGER.item}
          className="flex flex-wrap items-start gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        >
          {STATS.map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
              <p className="text-xl sm:text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
              {sub && <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500">{sub}</p>}
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div variants={STAGGER.item} className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-300"
          />
        </motion.div>

        {/* Vendors Table */}
        <motion.div variants={STAGGER.item} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  {['Vendor', 'Category', 'YTD Spend', 'Invoices', 'Trend', 'Last Transaction', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                {VENDORS.map((v, i) => (
                  <motion.tr
                    key={v.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          <Store className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold tabular-nums text-gray-900 dark:text-zinc-50">{v.ytd}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-zinc-400">{v.invoices}</td>
                    <td className="px-5 py-3.5">
                      {v.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                      {v.trend === 'down' && <TrendingDown className="h-4 w-4 text-[#2D6A4F] dark:text-[#C8F400]" />}
                      {v.trend === 'flat' && <div className="h-0.5 w-4 rounded bg-gray-300 dark:bg-zinc-600" />}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 dark:text-zinc-500">{v.last}</td>
                    <td className="px-5 py-3.5">
                      <button className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
