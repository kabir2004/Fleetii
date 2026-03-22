import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  keyExtractor: (row: T) => string
  selectable?: boolean
  selectedKeys?: Set<string>
  onSelectionChange?: (keys: Set<string>) => void
  emptyMessage?: string
  rowClassName?: (row: T) => string
}

export function DataTable<T>({
  columns, data, isLoading, onRowClick, keyExtractor,
  selectable, selectedKeys, onSelectionChange, emptyMessage, rowClassName
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    const allKeys = new Set(data.map(keyExtractor))
    const currentSelected = selectedKeys ?? new Set<string>()
    onSelectionChange(currentSelected.size === data.length ? new Set() : allKeys)
  }

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange) return
    const newSet = new Set(selectedKeys ?? [])
    if (newSet.has(key)) newSet.delete(key)
    else newSet.add(key)
    onSelectionChange(newSet)
  }

  const allSelected = data.length > 0 && (selectedKeys?.size ?? 0) === data.length

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left">
                  <div className="h-3.5 w-20 bg-gray-100 dark:bg-zinc-700 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-zinc-800/50">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3.5">
                    <div className="h-3.5 w-full max-w-[120px] bg-gray-100 dark:bg-zinc-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-zinc-300 select-none',
                    col.width
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        : <ChevronsUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-14 text-center text-gray-400 dark:text-zinc-500 text-sm">
                    {emptyMessage ?? 'No data found'}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => {
                  const key = keyExtractor(row)
                  const isSelected = selectedKeys?.has(key) ?? false
                  return (
                    <motion.tr
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: idx * 0.02 }}
                      className={cn(
                        'border-b border-gray-50 dark:border-zinc-800/50 transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50',
                        isSelected && 'bg-blue-50 dark:bg-blue-950/30',
                        rowClassName?.(row)
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td className="w-10 px-4 py-3.5" onClick={e => { e.stopPropagation(); handleSelectRow(key) }}>
                          <Checkbox checked={isSelected} onCheckedChange={() => handleSelectRow(key)} />
                        </td>
                      )}
                      {columns.map(col => (
                        <td
                          key={col.key}
                          className={cn(
                            'px-4 py-3.5 text-sm text-gray-700 dark:text-zinc-300',
                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                          )}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                    </motion.tr>
                  )
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
