import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, Truck, Users, FileText, LayoutDashboard, TrendingUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_LOADS, MOCK_DRIVERS, MOCK_VEHICLES } from '@/lib/mockData'

interface CommandItem {
  id: string
  label: string
  sublabel?: string
  href: string
  icon: React.ElementType
  category: string
}

function buildCommands(): CommandItem[] {
  const pages: CommandItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { id: 'loads', label: 'Loads', href: '/dashboard/loads', icon: Package, category: 'Pages' },
    { id: 'fleet', label: 'Fleet', href: '/dashboard/fleet', icon: Truck, category: 'Pages' },
    { id: 'drivers', label: 'Drivers', href: '/dashboard/drivers', icon: Users, category: 'Pages' },
    { id: 'invoices', label: 'Invoices', href: '/dashboard/finance/invoices', icon: FileText, category: 'Pages' },
    { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, category: 'Pages' },
  ]

  const loads = MOCK_LOADS.map(l => ({
    id: l.id,
    label: l.load_number,
    sublabel: `${l.shipper_address?.city} → ${l.consignee_address?.city}`,
    href: `/dashboard/loads/${l.id}`,
    icon: Package,
    category: 'Loads',
  }))

  const drivers = MOCK_DRIVERS.map(d => ({
    id: d.id,
    label: `${d.first_name} ${d.last_name}`,
    sublabel: 'Driver',
    href: `/dashboard/drivers/${d.id}`,
    icon: Users,
    category: 'Drivers',
  }))

  const vehicles = MOCK_VEHICLES.slice(0, 6).map(v => ({
    id: v.id,
    label: v.unit_number,
    sublabel: `${v.year} ${v.make} ${v.model}`,
    href: `/dashboard/fleet/${v.id}`,
    icon: Truck,
    category: 'Fleet',
  }))

  return [...pages, ...loads, ...drivers, ...vehicles]
}

const ALL_COMMANDS = buildCommands()

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()

  const filtered = query.trim()
    ? ALL_COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        (c.sublabel?.toLowerCase().includes(query.toLowerCase())) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COMMANDS.slice(0, 8)

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const handleSelect = (item: CommandItem) => {
    navigate(item.href)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && filtered[selected]) {
      handleSelect(filtered[selected])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // Group by category
  const grouped: Record<string, CommandItem[]> = {}
  filtered.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  let globalIndex = 0

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search loads, drivers, fleet, pages..."
                  className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 outline-none text-sm"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-zinc-300">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="text-xs bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-500">ESC</kbd>
              </div>

              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-zinc-500">No results found</p>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <p className="px-4 py-1.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                        {category}
                      </p>
                      {items.map(item => {
                        const isSelected = globalIndex === selected
                        const idx = globalIndex++
                        const IconComp = item.icon
                        return (
                          <button
                            key={item.id}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                              isSelected ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                            )}
                            onMouseEnter={() => setSelected(idx)}
                            onClick={() => handleSelect(item)}
                          >
                            <IconComp className="h-4 w-4 shrink-0 text-zinc-500" />
                            <span className="font-medium">{item.label}</span>
                            {item.sublabel && <span className="text-zinc-600 text-xs">{item.sublabel}</span>}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
