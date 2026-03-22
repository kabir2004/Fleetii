export const APP_NAME = 'Fleetii'
export const APP_TAGLINE = 'The financial OS for trucking'

export const LOAD_STATUS_LABELS: Record<string, string> = {
  created: 'Created',
  dispatched: 'Dispatched',
  in_transit: 'In Transit',
  at_pickup: 'At Pickup',
  picked_up: 'Picked Up',
  at_delivery: 'At Delivery',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
}

export const LOAD_STATUS_COLORS: Record<string, string> = {
  created: 'bg-gray-100 text-gray-600 border-gray-200',
  dispatched: 'bg-blue-50 text-blue-700 border-blue-100',
  in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  at_pickup: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  picked_up: 'bg-orange-50 text-orange-700 border-orange-100',
  at_delivery: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-green-50 text-green-700 border-green-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
  disputed: 'bg-amber-50 text-amber-700 border-amber-100',
}

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
  under_review: 'bg-blue-50 text-blue-700 border-blue-100',
  approved: 'bg-green-50 text-green-700 border-green-100',
  disputed: 'bg-red-50 text-red-700 border-red-100',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  overdue: 'bg-orange-50 text-orange-700 border-orange-100',
  void: 'bg-gray-100 text-gray-400 border-gray-200',
}

export const DRIVER_STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-50 text-green-700 border-green-100',
  on_load: 'bg-blue-50 text-blue-700 border-blue-100',
  off_duty: 'bg-gray-100 text-gray-600 border-gray-200',
  suspended: 'bg-orange-50 text-orange-700 border-orange-100',
  terminated: 'bg-red-50 text-red-700 border-red-100',
}

export const VEHICLE_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-100',
  in_maintenance: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  out_of_service: 'bg-red-50 text-red-700 border-red-100',
  retired: 'bg-gray-100 text-gray-400 border-gray-200',
}

export const NAVIGATION_ITEMS = [
  {
    group: 'OVERVIEW',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' }],
  },
  {
    group: 'OPERATIONS',
    items: [
      { label: 'Loads', href: '/dashboard/loads', icon: 'Package' },
      { label: 'Load Board', href: '/dashboard/load-board', icon: 'Clipboard' },
      { label: 'Fleet', href: '/dashboard/fleet', icon: 'Truck' },
      { label: 'Drivers', href: '/dashboard/drivers', icon: 'Users' },
    ],
  },
  {
    group: 'FINANCE',
    items: [
      { label: 'Spend', href: '/dashboard/finance', icon: 'BarChart3' },
      { label: 'Invoices', href: '/dashboard/finance/invoices', icon: 'FileText' },
      { label: 'Payments', href: '/dashboard/finance/payments', icon: 'CreditCard' },
      { label: 'Billing', href: '/dashboard/finance/billing', icon: 'Receipt' },
      { label: 'Fuel Cards', href: '/dashboard/finance/fuel', icon: 'Fuel' },
      { label: 'Savings', href: '/dashboard/finance/savings', icon: 'PiggyBank' },
    ],
  },
  {
    group: 'ANALYTICS',
    items: [
      { label: 'Dashboard', href: '/dashboard/analytics', icon: 'TrendingUp' },
      { label: 'Lane Analytics', href: '/dashboard/analytics/lanes', icon: 'Route' },
      { label: 'Carrier Scorecard', href: '/dashboard/analytics/carriers', icon: 'Star' },
      { label: 'Reports', href: '/dashboard/analytics/reports', icon: 'FileBarChart' },
    ],
  },
  {
    group: 'COMPLIANCE',
    items: [
      { label: 'Overview', href: '/dashboard/compliance', icon: 'Shield' },
      { label: 'Documents', href: '/dashboard/compliance/documents', icon: 'FolderOpen' },
      { label: 'Safety', href: '/dashboard/compliance/safety', icon: 'AlertTriangle' },
    ],
  },
]
