import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatCurrency(amount: number | undefined | null, compact = false): string {
  if (amount === undefined || amount === null) return '$—'
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(dateStr: string | undefined | null, fmt = 'MMM d, yyyy'): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return '—'
  }
}

export function formatDateTime(dateStr: string | undefined | null): string {
  return formatDate(dateStr, 'MMM d, yyyy h:mm a')
}

export function formatRelativeTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatMiles(miles: number | undefined | null): string {
  if (miles === undefined || miles === null) return '—'
  return `${formatNumber(Math.round(miles))} mi`
}

export function formatWeight(lbs: number | undefined | null): string {
  if (lbs === undefined || lbs === null) return '—'
  return `${formatNumber(lbs)} lbs`
}

export function formatPercent(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

export function formatRatePerMile(rate: number | undefined | null): string {
  if (rate === undefined || rate === null) return '—'
  return `$${rate.toFixed(3)}/mi`
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
