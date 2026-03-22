import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompanyType } from '@/types/common.types'

interface OnboardingState {
  currentStep: number
  companyType: CompanyType | null
  companyName: string
  dotNumber: string
  mcNumber: string
  fleetSize: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setCompanyType: (type: CompanyType) => void
  setCompanyDetails: (details: { companyName: string; dotNumber: string; mcNumber: string }) => void
  setFleetSize: (size: number) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      companyType: null,
      companyName: '',
      dotNumber: '',
      mcNumber: '',
      fleetSize: 5,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      setCompanyType: (companyType) => set({ companyType }),
      setCompanyDetails: (details) => set(details),
      setFleetSize: (fleetSize) => set({ fleetSize }),
      reset: () => set({ currentStep: 0, companyType: null, companyName: '', dotNumber: '', mcNumber: '', fleetSize: 5 }),
    }),
    { name: 'fleetii-onboarding' }
  )
)
