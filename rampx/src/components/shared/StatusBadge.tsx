import { cn } from '@/lib/utils'
import {
  LOAD_STATUS_COLORS, LOAD_STATUS_LABELS,
  INVOICE_STATUS_COLORS, DRIVER_STATUS_COLORS, VEHICLE_STATUS_COLORS
} from '@/lib/constants'

type StatusType = 'load' | 'invoice' | 'driver' | 'vehicle'

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const STATUS_LABEL_MAPS: Record<StatusType, Record<string, string>> = {
  load: LOAD_STATUS_LABELS,
  invoice: {
    pending: 'Pending', under_review: 'Under Review', approved: 'Approved',
    disputed: 'Disputed', paid: 'Paid', overdue: 'Overdue', void: 'Void',
  },
  driver: {
    available: 'Available', on_load: 'On Load', off_duty: 'Off Duty',
    suspended: 'Suspended', terminated: 'Terminated',
  },
  vehicle: {
    active: 'Active', in_maintenance: 'In Maintenance',
    out_of_service: 'Out of Service', retired: 'Retired',
  },
}

const STATUS_COLOR_MAPS: Record<StatusType, Record<string, string>> = {
  load: LOAD_STATUS_COLORS,
  invoice: INVOICE_STATUS_COLORS,
  driver: DRIVER_STATUS_COLORS,
  vehicle: VEHICLE_STATUS_COLORS,
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const label = STATUS_LABEL_MAPS[type][status] ?? status
  const colorClass = STATUS_COLOR_MAPS[type][status] ?? 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
      colorClass,
      className
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  )
}
