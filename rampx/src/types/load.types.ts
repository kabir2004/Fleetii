export type LoadStatus =
  | 'created'
  | 'dispatched'
  | 'in_transit'
  | 'at_pickup'
  | 'picked_up'
  | 'at_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type EquipmentType =
  | 'dry_van'
  | 'reefer'
  | 'flatbed'
  | 'step_deck'
  | 'lowboy'
  | 'tanker'
  | 'box_truck'
  | 'sprinter'

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Load {
  id: string
  company_id: string
  load_number: string
  reference_number?: string
  status: LoadStatus
  shipper_name?: string
  shipper_address?: Address
  consignee_name?: string
  consignee_address?: Address
  pickup_date?: string
  delivery_date?: string
  actual_pickup?: string
  actual_delivery?: string
  commodity?: string
  weight_lbs?: number
  pieces?: number
  equipment_type?: EquipmentType
  temperature_min?: number
  temperature_max?: number
  hazmat?: boolean
  special_instructions?: string
  driver_id?: string
  vehicle_id?: string
  trailer_id?: string
  customer_rate?: number
  carrier_rate?: number
  driver_pay?: number
  fuel_surcharge?: number
  accessorial_charges?: number
  total_revenue?: number
  total_cost?: number
  margin?: number
  margin_percentage?: number
  miles?: number
  rate_per_mile?: number
  carrier_name?: string
  carrier_mc?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Joined fields
  driver?: {
    id: string
    first_name: string
    last_name: string
  }
  vehicle?: {
    id: string
    unit_number: string
  }
}

export interface CreateLoadInput {
  load_number: string
  reference_number?: string
  shipper_name: string
  shipper_address: Address
  consignee_name: string
  consignee_address: Address
  pickup_date: string
  delivery_date: string
  commodity: string
  weight_lbs: number
  equipment_type: EquipmentType
  hazmat: boolean
  customer_rate: number
  driver_pay: number
  fuel_surcharge?: number
  driver_id?: string
  vehicle_id?: string
  miles?: number
}
