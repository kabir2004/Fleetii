import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  company_id: string
  onboarding_step: number
  avatar_url?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },
}))
