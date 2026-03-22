import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  notificationPanelOpen: boolean
  darkMode: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setNotificationPanelOpen: (open: boolean) => void
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      notificationPanelOpen: false,
      darkMode: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: 'fleetii-ui' }
  )
)
