import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { CommandPalette } from '@/components/dashboard/CommandPalette'
import { NotificationPanel } from '@/components/dashboard/NotificationPanel'
import { useUIStore } from '@/stores/uiStore'

export function DashboardLayout() {
  const { commandPaletteOpen, setCommandPaletteOpen, darkMode, setSidebarCollapsed } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandPaletteOpen])

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => setSidebarCollapsed(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <NotificationPanel />
    </div>
  )
}
