import { NavLink, Outlet } from 'react-router-dom'
import { User, Building2, Users, Plug, Bell, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

const SETTINGS_NAV = [
  { label: 'Profile', href: '/dashboard/settings', icon: User, exact: true },
  { label: 'Company', href: '/dashboard/settings/company', icon: Building2 },
  { label: 'Team', href: '/dashboard/settings/team', icon: Users },
  { label: 'Integrations', href: '/dashboard/settings/integrations', icon: Plug },
  { label: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
  { label: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
]

export default function SettingsLayout() {
  return (
    <div className="p-4 md:p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-6">Settings</h1>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">

        {/* Nav — horizontal scrollable tab bar on mobile, vertical list on md+ */}
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-row overflow-x-auto md:overflow-x-visible md:flex-col gap-1 md:gap-0 md:space-y-0.5 pb-1 md:pb-0 scrollbar-none">
            {SETTINGS_NAV.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                className={({ isActive }) => cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors shrink-0 md:shrink',
                  isActive
                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 font-medium'
                    : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
