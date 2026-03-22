export type DriverStatus = 'available' | 'on_load' | 'off_duty' | 'suspended' | 'terminated'
export type CDLClass = 'A' | 'B' | 'C'
export type PayType = 'per_mile' | 'percentage' | 'hourly' | 'salary'

export interface Driver {
  id: string
  company_id: string
  profile_id?: string
  first_name: string
  last_name: string
  email?: string
  phone: string
  cdl_number?: string
  cdl_state?: string
  cdl_expiry?: string
  cdl_class?: CDLClass
  medical_card_expiry?: string
  drug_test_date?: string
  hire_date?: string
  status: DriverStatus
  home_base?: string
  pay_type?: PayType
  pay_rate?: number
  ytd_miles?: number
  ytd_earnings?: number
  safety_score?: number
  created_at: string
  updated_at: string
}
