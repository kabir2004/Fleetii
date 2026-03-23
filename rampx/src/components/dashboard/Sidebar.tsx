import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Inbox, TrendingUp, ArrowLeftRight, CreditCard, Building2,
  Receipt, Store, RotateCcw, Calculator, Settings2, Gift,
  LogOut, ChevronLeft, ChevronRight, Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inbox',          href: '/dashboard',                    icon: Inbox,           badge: 3, exact: true },
  { label: 'Insights',       href: '/dashboard/analytics',          icon: TrendingUp,      exact: true },
  { label: 'Transactions',   href: '/dashboard/finance/payments',   icon: ArrowLeftRight   },
  { label: 'Cards',          href: '/dashboard/finance/fuel',       icon: CreditCard       },
  { label: 'Company',        href: '/dashboard/fleet',              icon: Building2        },
  { label: 'Bill Pay',       href: '/dashboard/finance/billing',    icon: Receipt          },
  { label: 'Vendors',        href: '/dashboard/vendors',            icon: Store            },
  { label: 'Reimbursements', href: '/dashboard/finance/savings',    icon: RotateCcw        },
  { label: 'Accounting',     href: '/dashboard/finance',            icon: Calculator,      exact: true },
]

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'My Fleetii', href: '/dashboard/settings', icon: Settings2 },
]

function useIsActive(href: string, exact?: boolean) {
  const location = useLocation()
  if (exact) return location.pathname === href
  return (
    location.pathname === href ||
    (location.pathname.startsWith(href) && location.pathname[href.length] === '/')
  )
}

interface FlatNavItemProps {
  item: NavItem
  collapsed: boolean
  onNavClick?: () => void
}

function FlatNavItem({ item, collapsed, onNavClick }: FlatNavItemProps) {
  const { icon: Icon, label, href, badge, exact } = item
  const active = useIsActive(href, exact)
  const navigate = useNavigate()

  const inner = (
    <button
      onClick={() => {
        navigate(href)
        onNavClick?.()
      }}
      className={cn(
        'w-full flex items-center rounded-xl transition-all duration-150',
        collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
        active
          ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-sm'
          : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
      )}
    >
      <div className="relative shrink-0">
        <Icon className={cn(
          'h-[18px] w-[18px]',
          active ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'
        )} />
        {/* Collapsed badge dot */}
        {collapsed && badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#C8F400]" />
        )}
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'flex-1 overflow-hidden whitespace-nowrap text-sm flex items-center justify-between',
              active ? 'font-semibold' : 'font-medium'
            )}
          >
            {label}
            {badge && badge > 0 && (
              <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C8F400] px-1.5 text-[10px] font-bold text-zinc-900 leading-none">
                {badge}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return inner
}

function ReferEarnItem({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const navigate = useNavigate()

  const inner = (
    <button
      onClick={() => {
        navigate('/dashboard/refer')
        onNavClick?.()
      }}
      className={cn(
        'w-full flex items-center rounded-xl transition-all duration-150',
        collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
        'text-[#2D6A4F] dark:text-[#C8F400] hover:bg-gray-100 dark:hover:bg-zinc-800'
      )}
    >
      <Gift className="h-[18px] w-[18px] shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap text-sm font-medium"
          >
            Refer &amp; Earn
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right">Refer &amp; Earn</TooltipContent>
      </Tooltip>
    )
  }

  return inner
}

interface SidebarProps {
  onNavClick?: () => void
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar, darkMode } = useUIStore()
  const { signOut } = useAuthStore()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        className="flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full"
        animate={{ width: sidebarCollapsed ? 56 : 240 }}
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

        {/* Main Nav */}
        <ScrollArea className="flex-1 py-3">
          <nav className={cn('space-y-0.5', sidebarCollapsed ? 'px-1.5' : 'px-2')}>
            {NAV_ITEMS.map(item => (
              <FlatNavItem key={item.href} item={item} collapsed={sidebarCollapsed} onNavClick={onNavClick} />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Section */}
        <div className={cn(
          'border-t border-gray-200 dark:border-zinc-800 py-2 shrink-0 space-y-0.5',
          sidebarCollapsed ? 'px-1.5' : 'px-2'
        )}>
          {BOTTOM_ITEMS.map(item => (
            <FlatNavItem key={item.href} item={item} collapsed={sidebarCollapsed} onNavClick={onNavClick} />
          ))}

          <ReferEarnItem collapsed={sidebarCollapsed} onNavClick={onNavClick} />

          {/* Sign Out */}
          {sidebarCollapsed ? (
            <div className="space-y-0.5 pt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center rounded-lg py-2.5 text-gray-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
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
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              Sign Out
            </button>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
