export type VehicleType = 'tractor' | 'straight_truck' | 'trailer' | 'reefer' | 'flatbed' | 'tanker' | 'box_truck'
export type VehicleStatus = 'active' | 'in_maintenance' | 'out_of_service' | 'retired'

export interface GpsLocation {
  lat: number
  lng: number
  timestamp: string
  city?: string
  state?: string
}

export interface Vehicle {
  id: string
  company_id: string
  unit_number: string
  vin?: string
  make?: string
  model?: string
  year?: number
  vehicle_type: VehicleType
  status: VehicleStatus
  license_plate?: string
  license_state?: string
  current_mileage?: number
  next_maintenance_date?: string
  insurance_expiry?: string
  registration_expiry?: string
  gps_device_id?: string
  last_known_location?: GpsLocation
  created_at: string
  updated_at: string
}
