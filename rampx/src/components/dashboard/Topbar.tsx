import { Bell, Search, ChevronDown, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { getInitials } from '@/lib/formatters'
import { MOCK_NOTIFICATIONS } from '@/lib/mockData'

function LiveClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="text-sm tabular-nums font-medium text-gray-500 dark:text-zinc-400 tracking-tight min-w-[72px] text-right">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

interface TopbarProps {
  onOpenCommandPalette?: () => void
}

export function Topbar({ onOpenCommandPalette }: TopbarProps) {
  const navigate = useNavigate()
  const { setNotificationPanelOpen, darkMode, toggleDarkMode } = useUIStore()
  const { user, signOut } = useAuthStore()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length
  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Demo User'
  const initials    = user ? getInitials(user.first_name, user.last_name) : 'DU'

  return (
    <header className="h-14 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center px-3 sm:px-6 gap-2 sm:gap-4 shrink-0">

      {/* Search */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm text-gray-400 dark:text-zinc-500 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 transition-colors w-44 md:w-64"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto text-xs bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded px-1.5 py-0.5 text-gray-400 dark:text-zinc-400">⌘K</kbd>
      </button>

      <span className="hidden lg:block text-sm text-gray-400 dark:text-zinc-500 truncate">Northbound Freight LLC · March 2024</span>

      <div className="flex-1" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Live clock */}
      <span className="hidden sm:block">
        <LiveClock />
      </span>

      {/* Notifications */}
      <button
        onClick={() => setNotificationPanelOpen(true)}
        className="relative h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gray-900 dark:bg-white text-[10px] font-bold text-white dark:text-gray-900 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 dark:text-zinc-300 hidden md:block">{displayName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500 hidden md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <DropdownMenuLabel className="text-gray-900 dark:text-zinc-100">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-100 dark:bg-zinc-800" />
          <DropdownMenuItem asChild>
            <a href="/dashboard/settings" className="text-gray-700 dark:text-zinc-300">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard/settings/company" className="text-gray-700 dark:text-zinc-300">Company</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100 dark:bg-zinc-800" />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-600">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
