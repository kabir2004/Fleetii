import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, Clipboard, Truck, Users, BarChart3,
  FileText, CreditCard, Receipt, Fuel, PiggyBank, TrendingUp,
  Route, Star, FileBarChart, Shield, FolderOpen, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronDown, LogOut, Banknote, Landmark,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Package, Clipboard, Truck, Users, BarChart3,
  FileText, CreditCard, Receipt, Fuel, PiggyBank, TrendingUp,
  Route, Star, FileBarChart, Shield, FolderOpen, AlertTriangle,
  Banknote, Landmark,
}

const NAV_GROUPS = [
  {
    key: 'overview',
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', exact: true }],
  },
  {
    key: 'operations',
    label: 'Operations',
    items: [
      { label: 'Loads',      href: '/dashboard/loads',      icon: 'Package'   },
      { label: 'Load Board', href: '/dashboard/load-board', icon: 'Clipboard' },
      { label: 'Fleet',      href: '/dashboard/fleet',      icon: 'Truck'     },
      { label: 'Drivers',    href: '/dashboard/drivers',    icon: 'Users'     },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    items: [
      { label: 'Spend',      href: '/dashboard/finance',          icon: 'BarChart3', exact: true },
      { label: 'Invoices',   href: '/dashboard/finance/invoices', icon: 'FileText'  },
      { label: 'Payments',   href: '/dashboard/finance/payments', icon: 'CreditCard'},
      { label: 'Billing',    href: '/dashboard/finance/billing',  icon: 'Receipt'   },
      { label: 'Fuel Cards', href: '/dashboard/finance/fuel',      icon: 'Fuel'      },
      { label: 'Savings',    href: '/dashboard/finance/savings',   icon: 'PiggyBank' },
      { label: 'Payroll',    href: '/dashboard/finance/payroll',   icon: 'Banknote'  },
      { label: 'Cash Flow',  href: '/dashboard/finance/cashflow',  icon: 'Landmark'  },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    items: [
      { label: 'Dashboard',       href: '/dashboard/analytics',           icon: 'TrendingUp',  exact: true },
      { label: 'Lane Performance',href: '/dashboard/analytics/lanes',    icon: 'Route'        },
      { label: 'Carrier Ratings', href: '/dashboard/analytics/carriers', icon: 'Star'         },
      { label: 'Reports',         href: '/dashboard/analytics/reports',  icon: 'FileBarChart' },
    ],
  },
  {
    key: 'compliance',
    label: 'Compliance',
    items: [
      { label: 'Overview',  href: '/dashboard/compliance',           icon: 'Shield',       exact: true },
      { label: 'Documents', href: '/dashboard/compliance/documents', icon: 'FolderOpen'    },
      { label: 'Safety',    href: '/dashboard/compliance/safety',    icon: 'AlertTriangle' },
    ],
  },
]

function isGroupActive(items: typeof NAV_GROUPS[0]['items'], pathname: string) {
  return items.some(item =>
    item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href) && (pathname === item.href || pathname[item.href.length] === '/')
  )
}

interface NavItemProps {
  label: string
  href: string
  icon: string
  exact?: boolean
  collapsed: boolean
}

function NavItem({ label, href, icon, exact, collapsed }: NavItemProps) {
  const location = useLocation()
  const IconComp = ICON_MAP[icon]
  const isActive = exact
    ? location.pathname === href
    : location.pathname.startsWith(href) && (location.pathname === href || location.pathname[href.length] === '/')

  const item = (
    <NavLink
      to={href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-100 group',
        isActive
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
          : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100'
      )}
    >
      {IconComp && (
        <IconComp className={cn(
          'h-3.5 w-3.5 shrink-0',
          isActive ? 'text-white dark:text-gray-900' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'
        )} />
      )}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return item
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, darkMode } = useUIStore()
  const { signOut } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(NAV_GROUPS.map(g => g.key))
  )

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        className="flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full"
        animate={{ width: sidebarCollapsed ? 56 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center border-b border-gray-200 dark:border-zinc-800 px-4 h-14 shrink-0',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <AnimatePresence mode="wait">
            {sidebarCollapsed ? (
              <motion.img
                key="icon"
                src={darkMode ? '/fleettiilogodark.png' : '/fleetiilogolight.png'}
                alt="Fleetii"
                className="h-7 w-7 object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.div
                key="logo"
                className="flex items-center gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img
                  src={darkMode ? '/fleettiilogodark.png' : '/fleetiilogolight.png'}
                  alt="Fleetii"
                  className="h-8 w-8 object-contain"
                />
                <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Fleetii</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="h-6 w-6 rounded flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-3">
          <nav className="px-2 space-y-0.5">
            {NAV_GROUPS.map(({ key, label, items }) => {
              const active = isGroupActive(items, location.pathname)
              const open = openGroups.has(key)

              if (sidebarCollapsed) {
                return (
                  <div key={key} className="space-y-0.5 mb-1">
                    {items.map(item => (
                      <NavItem key={item.href} {...item} collapsed={true} />
                    ))}
                  </div>
                )
              }

              return (
                <div key={key}>
                  <button
                    onClick={() => toggleGroup(key)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      active
                        ? 'text-gray-900 dark:text-zinc-100'
                        : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <span>{label}</span>
                    <ChevronDown className={cn(
                      'h-3 w-3 transition-transform duration-200',
                      open ? 'rotate-0' : '-rotate-90'
                    )} />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-2 pt-0.5 pb-1 space-y-0.5">
                          {items.map(item => (
                            <NavItem key={item.href} {...item} collapsed={false} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Sign out */}
        <div className="border-t border-gray-200 dark:border-zinc-800 p-2 shrink-0">
          {sidebarCollapsed ? (
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center rounded-lg px-2.5 py-1.5 text-sm text-gray-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
              <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center h-8 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              Sign Out
            </button>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
