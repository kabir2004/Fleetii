import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Weight, Truck, RefreshCw } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const BOARD_LOADS = [
  { id: 'bl-1', origin: 'Chicago, IL', destination: 'Nashville, TN', miles: 473, equipment: 'Dry Van', weight: '42,000 lbs', pickup: '2024-03-25', rate: 2850, rpm: 6.02 },
  { id: 'bl-2', origin: 'Memphis, TN', destination: 'Atlanta, GA', miles: 384, equipment: 'Reefer', weight: '38,500 lbs', pickup: '2024-03-24', rate: 2680, rpm: 6.98 },
  { id: 'bl-3', origin: 'Dallas, TX', destination: 'Phoenix, AZ', miles: 1076, equipment: 'Flatbed', weight: '44,000 lbs', pickup: '2024-03-26', rate: 5400, rpm: 5.02 },
  { id: 'bl-4', origin: 'Los Angeles, CA', destination: 'Las Vegas, NV', miles: 272, equipment: 'Dry Van', weight: '28,000 lbs', pickup: '2024-03-24', rate: 1800, rpm: 6.62 },
  { id: 'bl-5', origin: 'Denver, CO', destination: 'Kansas City, MO', miles: 608, equipment: 'Dry Van', weight: '36,000 lbs', pickup: '2024-03-27', rate: 3200, rpm: 5.26 },
  { id: 'bl-6', origin: 'Houston, TX', destination: 'Chicago, IL', miles: 1092, equipment: 'Tanker', weight: '46,000 lbs', pickup: '2024-03-25', rate: 5800, rpm: 5.31 },
  { id: 'bl-7', origin: 'Portland, OR', destination: 'Seattle, WA', miles: 178, equipment: 'Step Deck', weight: '40,000 lbs', pickup: '2024-03-24', rate: 1600, rpm: 8.99 },
  { id: 'bl-8', origin: 'Miami, FL', destination: 'Jacksonville, FL', miles: 340, equipment: 'Dry Van', weight: '32,000 lbs', pickup: '2024-03-26', rate: 2100, rpm: 6.18 },
]

const EQUIPMENT_TYPES = ['All', 'Dry Van', 'Reefer', 'Flatbed', 'Tanker', 'Step Deck']

function rpmColor(rpm: number) {
  if (rpm >= 7) return 'text-green-600'
  if (rpm >= 5.5) return 'text-amber-600'
  return 'text-red-500'
}

function rpmBg(rpm: number) {
  if (rpm >= 7) return 'bg-green-50 border-green-100'
  if (rpm >= 5.5) return 'bg-amber-50 border-amber-100'
  return 'bg-red-50 border-red-100'
}

const bestRpm = Math.max(...BOARD_LOADS.map(l => l.rpm))
const avgMiles = Math.round(BOARD_LOADS.reduce((s, l) => s + l.miles, 0) / BOARD_LOADS.length)

const KPI_STRIP = [
  { label: 'Available Loads', value: String(BOARD_LOADS.length), sub: '' },
  { label: 'Best Rate / Mile', value: `$${bestRpm.toFixed(2)}/mi`, sub: '' },
  { label: 'Avg Distance', value: `${avgMiles} mi`, sub: '' },
  { label: 'Next Pickup', value: 'Today', sub: '' },
]

export default function LoadBoardPage() {
  const [search, setSearch] = useState('')
  const [equipment, setEquipment] = useState('All')

  const filtered = BOARD_LOADS.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !search || l.origin.toLowerCase().includes(q) || l.destination.toLowerCase().includes(q)
    const matchEquip = equipment === 'All' || l.equipment === equipment
    return matchSearch && matchEquip
  }).sort((a, b) => b.rpm - a.rpm)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Load Board</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Available freight in the market</p>
        </div>
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
      <motion.div
        className="flex flex-wrap gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Search origin or destination..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100 focus:border-transparent w-full sm:w-72"
          />
        </div>

        {/* Equipment filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
          {EQUIPMENT_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setEquipment(t)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                equipment === t ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm' : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
          <RefreshCw className="h-3 w-3" />
          Updated 4 min ago
        </div>
      </motion.div>

      {/* Note */}
      <p className="text-xs text-gray-400 dark:text-zinc-500">Sorted by rate per mile, highest first.</p>

      {/* Load Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((load, i) => (
          <motion.div
            key={load.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all cursor-pointer group"
          >
            {/* Route */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-zinc-50">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                  {load.origin}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-gray-300 dark:text-zinc-600 shrink-0" />
                  {load.destination}
                </div>
              </div>

              {/* Rate / Mile badge — the key metric */}
              <div className={cn('rounded-lg border px-2.5 py-1.5 text-center', rpmBg(load.rpm))}>
                <p className={cn('text-base font-bold tabular-nums leading-none', rpmColor(load.rpm))}>
                  ${load.rpm.toFixed(2)}
                </p>
                <p className={cn('text-[10px] mt-0.5', rpmColor(load.rpm))}>per mile</p>
              </div>
            </div>

            {/* Total rate */}
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-zinc-50">{formatCurrency(load.rate)}</span>
              <span className="text-xs text-gray-400 dark:text-zinc-500">{load.miles} mi</span>
            </div>

            {/* Details */}
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500 pt-3.5 border-t border-gray-100 dark:border-zinc-800/50">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {load.equipment}
              </span>
              <span className="flex items-center gap-1">
                <Weight className="h-3.5 w-3.5" />
                {load.weight}
              </span>
              <span className="ml-auto">Pickup {formatDate(load.pickup, 'MMM d')}</span>
            </div>

            {/* Book button */}
            <button className="mt-3.5 w-full h-8 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
              Book Load
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
