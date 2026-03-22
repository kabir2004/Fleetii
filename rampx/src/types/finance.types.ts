export type InvoiceType = 'receivable' | 'payable'
export type InvoiceStatus = 'pending' | 'under_review' | 'approved' | 'disputed' | 'paid' | 'overdue' | 'void'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'ach' | 'wire' | 'check' | 'card' | 'factoring'

export interface LineItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Discrepancy {
  field: string
  expected: number
  actual: number
  amount: number
  resolved: boolean
}

export interface Invoice {
  id: string
  company_id: string
  invoice_number: string
  type: InvoiceType
  status: InvoiceStatus
  load_id?: string
  counterparty_name: string
  counterparty_email?: string
  issue_date: string
  due_date: string
  subtotal: number
  tax?: number
  total: number
  amount_paid?: number
  balance_due?: number
  currency: string
  line_items?: LineItem[]
  discrepancies?: Discrepancy[]
  savings_identified?: number
  notes?: string
  document_url?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  company_id: string
  invoice_id?: string
  type: 'outgoing' | 'incoming'
  status: PaymentStatus
  amount: number
  payment_method?: PaymentMethod
  payee_name?: string
  reference_number?: string
  scheduled_date?: string
  completed_date?: string
  created_at: string
}

export interface FuelTransaction {
  id: string
  company_id: string
  driver_id?: string
  vehicle_id?: string
  card_number_last4?: string
  merchant_name?: string
  location?: {
    city: string
    state: string
    lat?: number
    lng?: number
  }
  transaction_date: string
  gallons?: number
  price_per_gallon?: number
  total_amount: number
  fuel_type?: 'diesel' | 'def' | 'gas' | 'other'
  odometer_reading?: number
  flagged?: boolean
  flag_reason?: string
  created_at: string
}
