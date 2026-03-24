import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Inbox, TrendingUp, ArrowLeftRight, CreditCard, Building2,
  Receipt, Store, RotateCcw, Calculator, Settings2, Gift,
  LogOut, ChevronLeft, ChevronRight, ChevronDown,
  Users2, DollarSign, Fuel, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

/* ── types ───────────────────────────────────────────────────────────────── */

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  exact?: boolean
}

/* ── nav config ──────────────────────────────────────────────────────────── */

const NAV_ITEMS_BEFORE_INSIGHTS: NavItem[] = [
  { label: 'Inbox', href: '/dashboard', icon: Inbox, badge: 3, exact: true },
]

const NAV_ITEMS_AFTER_INSIGHTS: NavItem[] = [
  { label: 'Transactions',   href: '/dashboard/finance/payments', icon: ArrowLeftRight },
  { label: 'Cards',          href: '/dashboard/finance/fuel',     icon: CreditCard     },
  { label: 'Company',        href: '/dashboard/fleet',            icon: Building2      },
  { label: 'Bill Pay',       href: '/dashboard/finance/billing',  icon: Receipt        },
  { label: 'Vendors',        href: '/dashboard/vendors',          icon: Store          },
  { label: 'Reimbursements', href: '/dashboard/finance/savings',  icon: RotateCcw      },
  { label: 'Accounting',     href: '/dashboard/finance',          icon: Calculator,    exact: true },
]

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'My Fleetii', href: '/dashboard/settings', icon: Settings2 },
]

const INSIGHTS_SUB_ITEMS = [
  { label: 'Driver Performance', href: '/dashboard/insights/drivers',      icon: Users2     },
  { label: 'Profitability',      href: '/dashboard/insights/profitability', icon: DollarSign },
  { label: 'Fuel Intelligence',  href: '/dashboard/insights/fuel',          icon: Fuel       },
  { label: 'Revenue Forecast',   href: '/dashboard/insights/forecast',      icon: TrendingUp },
  { label: 'Health Score',       href: '/dashboard/insights/health',        icon: Activity   },
]

/* ── helpers ─────────────────────────────────────────────────────────────── */

function useIsActive(href: string, exact?: boolean) {
  const location = useLocation()
  if (exact) return location.pathname === href
  return (
    location.pathname === href ||
    (location.pathname.startsWith(href) && location.pathname[href.length] === '/')
  )
}

/* ── FlatNavItem ─────────────────────────────────────────────────────────── */

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
      onClick={() => { navigate(href); onNavClick?.() }}
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

/* ── InsightsGroup ───────────────────────────────────────────────────────── */

interface InsightsGroupProps {
  collapsed: boolean
  onNavClick?: () => void
}

function InsightsGroup({ collapsed, onNavClick }: InsightsGroupProps) {
  const location  = useLocation()
  const navigate  = useNavigate()

  const anyActive = location.pathname.startsWith('/dashboard/insights')
  const [open, setOpen] = useState(anyActive)

  // Auto-open the group whenever the user lands on an insights sub-route
  useEffect(() => {
    if (anyActive) setOpen(true)
  }, [anyActive])

  /* ── collapsed mode: icon only, no dropdown; click → first sub-page ── */
  if (collapsed) {
    const collapsedInner = (
      <button
        onClick={() => { navigate('/dashboard/insights/drivers'); onNavClick?.() }}
        className={cn(
          'w-full flex items-center justify-center rounded-xl py-2.5 transition-all duration-150',
          anyActive
            ? 'bg-gray-900 dark:bg-zinc-50 shadow-sm'
            : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
        )}
      >
        <TrendingUp className={cn(
          'h-[18px] w-[18px]',
          anyActive ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'
        )} />
      </button>
    )
    return (
      <Tooltip>
        <TooltipTrigger asChild>{collapsedInner}</TooltipTrigger>
        <TooltipContent side="right">Insights</TooltipContent>
      </Tooltip>
    )
  }

  /* ── expanded mode: label + chevron + animated sub-items ── */
  return (
    <div>
      {/* Parent row — toggles dropdown, does NOT navigate */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150',
          anyActive
            ? 'text-gray-900 dark:text-zinc-50'
            : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
        )}
      >
        <TrendingUp className={cn(
          'h-[18px] w-[18px] shrink-0',
          anyActive ? 'text-gray-900 dark:text-zinc-50' : 'text-gray-400 dark:text-zinc-500'
        )} />
        <span className={cn(
          'flex-1 text-sm text-left whitespace-nowrap overflow-hidden',
          anyActive ? 'font-semibold' : 'font-medium'
        )}>
          Insights
        </span>
        <ChevronDown className={cn(
          'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
          open ? 'rotate-180' : 'rotate-0',
          anyActive ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-300 dark:text-zinc-600'
        )} />
      </button>

      {/* Animated sub-items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="insights-sub"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Left rail + indented items */}
            <div className="mt-0.5 ml-[22px] pl-3 border-l border-gray-200 dark:border-zinc-800 space-y-0.5">
              {INSIGHTS_SUB_ITEMS.map(sub => {
                const SubIcon = sub.icon
                const isActive = location.pathname === sub.href
                return (
                  <button
                    key={sub.href}
                    onClick={() => { navigate(sub.href); onNavClick?.() }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150',
                      isActive
                        ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-sm'
                        : 'text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
                    )}
                  >
                    <SubIcon className={cn(
                      'h-3.5 w-3.5 shrink-0',
                      isActive ? 'text-white dark:text-zinc-900' : 'text-gray-400 dark:text-zinc-500'
                    )} />
                    <span className={cn(
                      'text-xs whitespace-nowrap overflow-hidden',
                      isActive ? 'font-semibold' : 'font-medium'
                    )}>
                      {sub.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── ReferEarnItem ───────────────────────────────────────────────────────── */

function ReferEarnItem({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const navigate = useNavigate()

  const inner = (
    <button
      onClick={() => { navigate('/dashboard/refer'); onNavClick?.() }}
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

/* ── Sidebar ─────────────────────────────────────────────────────────────── */

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
          'flex items-center border-b border-gray-200 dark:border-zinc-800 h-14 shrink-0',
          sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'
        )}>
          <AnimatePresence mode="wait">
            {sidebarCollapsed ? (
              <motion.img
                key="icon"
                src={darkMode ? '/fleettiilogodark-removebg-preview.png' : '/fleetiilogolight-removebg-preview.png'}
                alt="Fleetii"
                className="h-14 w-14 object-contain"
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
                  src={darkMode ? '/fleettiilogodark-removebg-preview.png' : '/fleetiilogolight-removebg-preview.png'}
                  alt="Fleetii"
                  className="h-10 w-10 object-contain"
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

            {/* Items before Insights */}
            {NAV_ITEMS_BEFORE_INSIGHTS.map(item => (
              <FlatNavItem key={item.href} item={item} collapsed={sidebarCollapsed} onNavClick={onNavClick} />
            ))}

            {/* Insights collapsible group */}
            <InsightsGroup collapsed={sidebarCollapsed} onNavClick={onNavClick} />

            {/* Items after Insights */}
            {NAV_ITEMS_AFTER_INSIGHTS.map(item => (
              <FlatNavItem key={item.href} item={item} collapsed={sidebarCollapsed} onNavClick={onNavClick} />
            ))}

          </nav>
        </ScrollArea>

        {/* Bottom section */}
        <div className={cn(
          'border-t border-gray-200 dark:border-zinc-800 py-2 shrink-0 space-y-0.5',
          sidebarCollapsed ? 'px-1.5' : 'px-2'
        )}>
          {BOTTOM_ITEMS.map(item => (
            <FlatNavItem key={item.href} item={item} collapsed={sidebarCollapsed} onNavClick={onNavClick} />
          ))}

          <ReferEarnItem collapsed={sidebarCollapsed} onNavClick={onNavClick} />

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
