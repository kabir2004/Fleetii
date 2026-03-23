import { useState, useMemo } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Line,
  Tooltip, ResponsiveContainer, ComposedChart, Bar, BarChart,
} from 'recharts'
import {
  DollarSign, Package, TrendingUp, PiggyBank,
  ArrowRight, AlertCircle, Clock, FileText, CheckCircle2, Search,
  Plus, Upload, Download, Banknote, ScanEye,
  GripVertical, Eye, EyeOff, LayoutPanelTop,
  Check, X as XIcon, Settings2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { MOCK_LOADS, MOCK_SPEND_BY_MONTH } from '@/lib/mockData'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN_DARK  = '#C8F400'
const GREEN_LIGHT = '#2D6A4F'
const SPEND_COLOR = '#818cf8'

const AUDIT_STATS = [
  { label: 'Invoices Audited',    value: '94',      sub: 'this month',        highlight: false },
  { label: 'Discrepancies Found', value: '23',      sub: '24.5% hit rate',    highlight: false },
  { label: 'Amount Recovered',    value: '$22,100', sub: 'avg $961 each',     highlight: true  },
  { label: 'Pending Review',      value: '7',       sub: 'awaiting approval',  highlight: false },
]

const ALL_ALERTS = [
  { id: 1, priority: 'high',   icon: FileText,    title: 'Invoice overdue · INV-2024-0392',  detail: '$4,292 · 3 days past due from Southeast Auto Dealers' },
  { id: 2, priority: 'high',   icon: Search,      title: 'Overcharge found · INV-2024-0391', detail: '$460 in overcharges from FastRoute Carrier Services'   },
  { id: 3, priority: 'medium', icon: Clock,       title: 'CDL expiring · Sandra Chen',       detail: 'Expires Dec 1, 2025 · Schedule renewal'               },
  { id: 4, priority: 'low',    icon: AlertCircle, title: 'Fuel flagged · Derek Johnson',      detail: 'Springfield, MO purchase 12% above market rate'       },
]

const priorityDot: Record<string, string> = {
  high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-blue-400',
}

const ALL_CHART_DATA = MOCK_SPEND_BY_MONTH.map((d: any) => ({
  ...d,
  margin: Math.round(((d.revenue - d.cost) / d.revenue) * 100),
}))

const QUICK_ACTIONS = [
  { label: 'New Load',        icon: Plus,     href: '/dashboard/loads/new',         primary: true  },
  { label: 'Upload',          icon: Upload,   href: '/dashboard/finance/invoices',  primary: false },
  { label: 'Process Payroll', icon: Banknote, href: '/dashboard/finance/payroll',   primary: false },
  { label: 'Agent Review',    icon: ScanEye,  href: '/dashboard/finance/savings',   primary: false },
  { label: 'Export',          icon: Download, href: '/dashboard/analytics/reports', primary: false },
]

// ─── Widget config types ───────────────────────────────────────────────────────

type KPITile    = 'revenue' | 'spend' | 'loads' | 'savings'
type ChartMonths = 3 | 6 | 12
type LoadsCount  = 5 | 10 | 15
type SortBy      = 'date' | 'revenue' | 'status'
type AlertFilter = 'all' | 'high' | 'high_medium'
type StatusFilter= 'all' | 'in_transit' | 'delivered' | 'pending' | 'invoiced'
type ChartType   = 'area' | 'line' | 'bar'
type Period      = 'month' | '30d' | 'qtd' | 'ytd'

interface KPIConfig {
  tiles: KPITile[]
  period: Period
  showTrend: boolean
  displayFormat: 'abbreviated' | 'full'
  highlightSavings: boolean
}

interface ChartConfig {
  months: ChartMonths
  chartType: ChartType
  showGrid: boolean
  showMarginLine: boolean
  showAudit: boolean
}

interface BottomConfig {
  loadsCount: LoadsCount
  statusFilter: StatusFilter
  sortBy: SortBy
  visibleCols: ('route' | 'status' | 'driver' | 'revenue')[]
  showAlerts: boolean
  alertFilter: AlertFilter
  compactRows: boolean
}

interface WidgetConfigs { kpis: KPIConfig; chart: ChartConfig; bottom: BottomConfig }

const DEFAULT_CONFIGS: WidgetConfigs = {
  kpis: {
    tiles: ['revenue', 'spend', 'loads', 'savings'],
    period: 'month',
    showTrend: true,
    displayFormat: 'abbreviated',
    highlightSavings: true,
  },
  chart: {
    months: 6,
    chartType: 'area',
    showGrid: true,
    showMarginLine: false,
    showAudit: true,
  },
  bottom: {
    loadsCount: 5,
    statusFilter: 'all',
    sortBy: 'date',
    visibleCols: ['route', 'status', 'driver', 'revenue'],
    showAlerts: true,
    alertFilter: 'all',
    compactRows: false,
  },
}

type WidgetId = 'kpis' | 'chart' | 'bottom'

const WIDGET_META: Record<WidgetId, { label: string; hint: string }> = {
  kpis:   { label: 'KPI Overview',    hint: 'Revenue, spend, loads & savings'  },
  chart:  { label: 'Revenue & Audit', hint: 'Area chart + audit performance'   },
  bottom: { label: 'Loads & Alerts',  hint: 'Recent loads + action required'   },
}

const DEFAULT_ORDER: WidgetId[] = ['kpis', 'chart', 'bottom']

// ─── Primitive UI ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn('relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0', checked ? 'bg-gray-900 dark:bg-zinc-100' : 'bg-gray-200 dark:bg-zinc-700')}
    >
      <motion.span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
        animate={{ left: checked ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      />
    </button>
  )
}

function SegmentControl<T extends string | number>({
  options, value, onChange,
}: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-xl bg-gray-100 dark:bg-zinc-800 p-0.5 gap-0.5">
      {options.map(opt => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
            value === opt.value
              ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 shadow-sm'
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function CheckRow({ checked, onChange, label, sub }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string
}) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-3 w-full text-left">
      <div className={cn('h-4 w-4 rounded-[5px] border-2 flex items-center justify-center transition-colors shrink-0',
        checked ? 'bg-gray-900 dark:bg-zinc-100 border-gray-900 dark:border-zinc-100' : 'border-gray-300 dark:border-zinc-600'
      )}>
        {checked && <Check className="h-2.5 w-2.5 text-white dark:text-zinc-900" />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-200 leading-none">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{sub}</p>}
      </div>
    </button>
  )
}

function ToggleRow({ checked, onChange, label, sub }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-200 leading-none">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function Divider() {
  return <div className="border-t border-gray-100 dark:border-zinc-800 my-1" />
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em]">{title}</p>
      {children}
    </div>
  )
}

// ─── Widget settings ──────────────────────────────────────────────────────────

function KPISettings({ cfg, onChange }: { cfg: KPIConfig; onChange: (c: Partial<KPIConfig>) => void }) {
  const tiles: { id: KPITile; label: string; sub: string }[] = [
    { id: 'revenue', label: 'Revenue This Month', sub: 'Total billed revenue'   },
    { id: 'spend',   label: 'Total Spend',         sub: 'All operating costs'   },
    { id: 'loads',   label: 'Active Loads',        sub: 'In-progress freight'   },
    { id: 'savings', label: 'Savings Found',       sub: 'AI audit recoveries'   },
  ]
  const toggleTile = (id: KPITile) => {
    const next = cfg.tiles.includes(id) ? cfg.tiles.filter(t => t !== id) : [...cfg.tiles, id]
    if (next.length > 0) onChange({ tiles: next })
  }
  return (
    <div className="space-y-5">
      <SettingsGroup title="Visible Tiles">
        {tiles.map(t => (
          <CheckRow key={t.id} checked={cfg.tiles.includes(t.id)} onChange={() => toggleTile(t.id)} label={t.label} sub={t.sub} />
        ))}
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Time Period">
        <SegmentControl
          options={[{ label: 'Month', value: 'month' }, { label: '30d', value: '30d' }, { label: 'QTD', value: 'qtd' }, { label: 'YTD', value: 'ytd' }]}
          value={cfg.period}
          onChange={period => onChange({ period })}
        />
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Display">
        <SettingsGroup title="">
          <SegmentControl
            options={[{ label: 'Abbreviated', value: 'abbreviated' }, { label: 'Full', value: 'full' }]}
            value={cfg.displayFormat}
            onChange={displayFormat => onChange({ displayFormat })}
          />
        </SettingsGroup>
        <ToggleRow checked={cfg.showTrend} onChange={v => onChange({ showTrend: v })} label="Trend Badges" sub="Show % change vs prior period" />
        <ToggleRow checked={cfg.highlightSavings} onChange={v => onChange({ highlightSavings: v })} label="Accent Savings Tile" sub="Volt green highlight on savings" />
      </SettingsGroup>
    </div>
  )
}

function ChartSettings({ cfg, onChange }: { cfg: ChartConfig; onChange: (c: Partial<ChartConfig>) => void }) {
  return (
    <div className="space-y-5">
      <SettingsGroup title="Date Range">
        <SegmentControl
          options={[{ label: '3M', value: 3 }, { label: '6M', value: 6 }, { label: '12M', value: 12 }]}
          value={cfg.months}
          onChange={months => onChange({ months: months as ChartMonths })}
        />
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Chart Style">
        <SegmentControl
          options={[{ label: 'Area', value: 'area' }, { label: 'Line', value: 'line' }, { label: 'Bar', value: 'bar' }]}
          value={cfg.chartType}
          onChange={chartType => onChange({ chartType: chartType as ChartType })}
        />
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Overlays">
        <ToggleRow checked={cfg.showGrid}       onChange={v => onChange({ showGrid: v })}       label="Grid Lines"       sub="Horizontal reference lines" />
        <ToggleRow checked={cfg.showMarginLine} onChange={v => onChange({ showMarginLine: v })} label="Gross Margin %"   sub="Overlay margin trend line"  />
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Panels">
        <ToggleRow checked={cfg.showAudit} onChange={v => onChange({ showAudit: v })} label="Audit Performance" sub="Invoice audit stats panel" />
      </SettingsGroup>
    </div>
  )
}

function BottomSettings({ cfg, onChange }: { cfg: BottomConfig; onChange: (c: Partial<BottomConfig>) => void }) {
  const cols: { id: 'route' | 'status' | 'driver' | 'revenue'; label: string }[] = [
    { id: 'route',   label: 'Route'   },
    { id: 'status',  label: 'Status'  },
    { id: 'driver',  label: 'Driver'  },
    { id: 'revenue', label: 'Revenue' },
  ]
  const toggleCol = (id: typeof cols[0]['id']) => {
    const next = cfg.visibleCols.includes(id) ? cfg.visibleCols.filter(c => c !== id) : [...cfg.visibleCols, id]
    if (next.length > 0) onChange({ visibleCols: next })
  }

  return (
    <div className="space-y-5">
      <SettingsGroup title="Loads Table">
        <SettingsGroup title="">
          <p className="text-xs text-gray-400 dark:text-zinc-500 -mt-1">Rows to display</p>
          <SegmentControl
            options={[{ label: '5', value: 5 }, { label: '10', value: 10 }, { label: '15', value: 15 }]}
            value={cfg.loadsCount}
            onChange={n => onChange({ loadsCount: n as LoadsCount })}
          />
        </SettingsGroup>
        <SettingsGroup title="">
          <p className="text-xs text-gray-400 dark:text-zinc-500">Filter by status</p>
          <SegmentControl
            options={[
              { label: 'All',      value: 'all'       },
              { label: 'Transit',  value: 'in_transit'},
              { label: 'Done',     value: 'delivered' },
              { label: 'Pending',  value: 'pending'   },
            ]}
            value={cfg.statusFilter}
            onChange={statusFilter => onChange({ statusFilter: statusFilter as StatusFilter })}
          />
        </SettingsGroup>
        <SettingsGroup title="">
          <p className="text-xs text-gray-400 dark:text-zinc-500">Sort by</p>
          <SegmentControl
            options={[{ label: 'Date', value: 'date' }, { label: 'Revenue', value: 'revenue' }, { label: 'Status', value: 'status' }]}
            value={cfg.sortBy}
            onChange={sortBy => onChange({ sortBy: sortBy as SortBy })}
          />
        </SettingsGroup>
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Visible Columns">
        {cols.map(c => (
          <CheckRow key={c.id} checked={cfg.visibleCols.includes(c.id)} onChange={() => toggleCol(c.id)} label={c.label} />
        ))}
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Layout">
        <ToggleRow checked={cfg.compactRows} onChange={v => onChange({ compactRows: v })} label="Compact Rows" sub="Tighter row padding" />
      </SettingsGroup>
      <Divider />
      <SettingsGroup title="Action Required">
        <ToggleRow checked={cfg.showAlerts} onChange={v => onChange({ showAlerts: v })} label="Show Panel" sub="Alerts sidebar" />
        {cfg.showAlerts && (
          <SettingsGroup title="">
            <p className="text-xs text-gray-400 dark:text-zinc-500">Priority filter</p>
            <SegmentControl
              options={[{ label: 'All', value: 'all' }, { label: 'High', value: 'high' }, { label: 'High+Med', value: 'high_medium' }]}
              value={cfg.alertFilter}
              onChange={alertFilter => onChange({ alertFilter: alertFilter as AlertFilter })}
            />
          </SettingsGroup>
        )}
      </SettingsGroup>
    </div>
  )
}

// ─── Settings drawer ──────────────────────────────────────────────────────────

function SettingsDrawer({ widgetId, configs, onUpdate, onClose, onReset }: {
  widgetId: WidgetId
  configs: WidgetConfigs
  onUpdate: <K extends WidgetId>(id: K, patch: Partial<WidgetConfigs[K]>) => void
  onClose: () => void
  onReset: (id: WidgetId) => void
}) {
  const { label } = WIDGET_META[widgetId]
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="fixed right-0 top-0 h-full w-72 z-50 flex flex-col bg-white dark:bg-zinc-900 border-l border-gray-100 dark:border-zinc-800 shadow-2xl"
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em] mb-1">Widget Settings</p>
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 leading-none">{label}</p>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors mt-0.5">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {widgetId === 'kpis'   && <KPISettings   cfg={configs.kpis}   onChange={p => onUpdate('kpis',   p)} />}
          {widgetId === 'chart'  && <ChartSettings  cfg={configs.chart}  onChange={p => onUpdate('chart',  p)} />}
          {widgetId === 'bottom' && <BottomSettings cfg={configs.bottom} onChange={p => onUpdate('bottom', p)} />}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 dark:border-zinc-800 shrink-0 flex items-center justify-between">
          <button onClick={() => onReset(widgetId)} className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">
            Reset to default
          </button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-3 py-1.5 text-xs font-semibold hover:bg-gray-700 dark:hover:bg-zinc-200 transition-colors">
            <Check className="h-3 w-3" /> Done
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ─── Widget sections ──────────────────────────────────────────────────────────

const PERIOD_LABELS: Record<Period, string> = {
  month: CURRENT_MONTH_LABEL,
  '30d': 'Last 30 days',
  qtd:   `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`,
  ytd:   'Year to date',
}

function KPISection({ cfg }: { cfg: KPIConfig }) {
  const rev  = cfg.displayFormat === 'abbreviated' ? formatCurrency(1247800, true) : '$1,247,800'
  const sp   = cfg.displayFormat === 'abbreviated' ? formatCurrency(934000, true)  : '$934,000'
  const sav  = cfg.displayFormat === 'abbreviated' ? formatCurrency(22100, true)   : '$22,100'

  const tileDefs: Record<KPITile, object> = {
    revenue: { title: 'Revenue This Month', value: rev,  subvalue: cfg.displayFormat === 'abbreviated' ? '$1,247,800' : undefined, ...(cfg.showTrend ? { trend: 'up', change: '+8.4%' } : {}) },
    spend:   { title: 'Total Spend',        value: sp,   subvalue: cfg.displayFormat === 'abbreviated' ? '$934,000'   : undefined, ...(cfg.showTrend ? { trend: 'up', change: '+3.1%' } : {}) },
    loads:   { title: 'Active Loads',       value: '53', description: '3 in transit · 2 dispatched · 1 at delivery' },
    savings: { title: 'Savings Found',      value: sav,  subvalue: cfg.displayFormat === 'abbreviated' ? '$22,100'    : undefined, ...(cfg.showTrend ? { trend: 'up', change: '+$4.2K' } : {}), ...(cfg.highlightSavings ? { accent: true } : {}) },
  }

  const visible = (['revenue', 'spend', 'loads', 'savings'] as KPITile[]).filter(id => cfg.tiles.includes(id))
  const colMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <div>
      <div className={cn('grid gap-4 items-stretch', colMap[visible.length] ?? 'grid-cols-2 md:grid-cols-4')}>
        {visible.map(id => <StatCard key={id} {...(tileDefs[id] as any)} />)}
      </div>
    </div>
  )
}

function ChartSection({ cfg, green, gridColor, tickColor, darkMode }: {
  cfg: ChartConfig; green: string; gridColor: string; tickColor: string; darkMode: boolean
}) {
  const chartData = ALL_CHART_DATA.slice(-cfg.months)
  const marginColor = darkMode ? '#f59e0b' : '#d97706'

  const sharedAxis = (
    <>
      {cfg.showGrid && <CartesianGrid strokeDasharray="0" stroke={gridColor} horizontal vertical={false} />}
      <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={v => v >= 1_000_000 ? `$${(v/1_000_000).toFixed(1)}M` : `$${(v/1_000).toFixed(0)}K`} axisLine={false} tickLine={false} width={52} />
      <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
    </>
  )

  const defs = (
    <defs>
      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={green}       stopOpacity={darkMode ? 0.3 : 0.22} />
        <stop offset="100%" stopColor={green}       stopOpacity={0} />
      </linearGradient>
      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={SPEND_COLOR} stopOpacity={0.2} />
        <stop offset="100%" stopColor={SPEND_COLOR} stopOpacity={0} />
      </linearGradient>
    </defs>
  )

  return (
    <div className={cn('grid grid-cols-1 gap-4', cfg.showAudit ? 'lg:grid-cols-3' : '')}>
      <div className={cn('rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-none', cfg.showAudit ? 'lg:col-span-2' : '')}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Revenue vs Spend</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Last {cfg.months} months</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: green }} />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: SPEND_COLOR }} />Spend</span>
            {cfg.showMarginLine && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: marginColor }} />Margin %</span>}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          {cfg.chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              {sharedAxis}
              <Bar dataKey="revenue" name="Revenue" fill={green}       fillOpacity={0.85} radius={[3,3,0,0]} />
              <Bar dataKey="cost"    name="Spend"   fill={SPEND_COLOR} fillOpacity={0.85} radius={[3,3,0,0]} />
            </BarChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              {defs}
              {sharedAxis}
              {cfg.chartType === 'area' ? (
                <>
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke={green}       strokeWidth={2.5} fill="url(#revGrad)"   dot={false} activeDot={{ r: 5, fill: green,       strokeWidth: 2, stroke: '#fff' }} />
                  <Area type="monotone" dataKey="cost"    name="Spend"   stroke={SPEND_COLOR} strokeWidth={2}   fill="url(#spendGrad)" dot={false} activeDot={{ r: 5, fill: SPEND_COLOR, strokeWidth: 2, stroke: '#fff' }} />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke={green}       strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: green,       strokeWidth: 2, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="cost"    name="Spend"   stroke={SPEND_COLOR} strokeWidth={2}   dot={false} activeDot={{ r: 5, fill: SPEND_COLOR, strokeWidth: 2, stroke: '#fff' }} />
                </>
              )}
              {cfg.showMarginLine && (
                <Line type="monotone" dataKey="margin" name="Margin %" stroke={marginColor} strokeWidth={1.5} strokeDasharray="4 3" dot={false} yAxisId={0} />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {cfg.showAudit && (
        <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Audit Performance</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{CURRENT_MONTH_LABEL}</p>
          </div>
          <div className="flex-1 space-y-5">
            {AUDIT_STATS.map(s => (
              <div key={s.label} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">{s.label}</p>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">{s.sub}</p>
                </div>
                <p className={`text-xl font-bold tabular-nums tracking-tight leading-none mt-0.5 ${s.highlight ? 'text-[#2D6A4F] dark:text-[#C8F400]' : 'text-gray-900 dark:text-zinc-50'}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-medium text-[#2D6A4F] dark:text-[#C8F400]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              All invoices audited within 24 hours
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BottomSection({ cfg, allLoads }: { cfg: BottomConfig; allLoads: any[] }) {
  const filtered = useMemo(() => {
    let list = [...allLoads]
    if (cfg.statusFilter !== 'all') list = list.filter(l => l.status === cfg.statusFilter)
    if (cfg.sortBy === 'revenue') list.sort((a, b) => (b.customer_rate ?? 0) - (a.customer_rate ?? 0))
    else if (cfg.sortBy === 'status') list.sort((a, b) => (a.status ?? '').localeCompare(b.status ?? ''))
    return list.slice(0, cfg.loadsCount)
  }, [allLoads, cfg.statusFilter, cfg.sortBy, cfg.loadsCount])

  const alerts = useMemo(() => {
    if (cfg.alertFilter === 'high')        return ALL_ALERTS.filter(a => a.priority === 'high')
    if (cfg.alertFilter === 'high_medium') return ALL_ALERTS.filter(a => a.priority !== 'low')
    return ALL_ALERTS
  }, [cfg.alertFilter])

  const py = cfg.compactRows ? 'py-2' : 'py-3.5'

  const allCols = ['route', 'status', 'driver', 'revenue'] as const
  const visibleHeaders = ['Load', ...allCols.filter(c => cfg.visibleCols.includes(c)).map(c => c.charAt(0).toUpperCase() + c.slice(1))]

  return (
    <div className={cn('grid grid-cols-1 gap-4', cfg.showAlerts ? 'lg:grid-cols-3' : '')}>
      <div className={cn('rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-none', cfg.showAlerts ? 'lg:col-span-2' : '')}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Recent Loads</p>
          <Link to="/dashboard/loads" className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 dark:border-zinc-800/60">
                {visibleHeaders.map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {filtered.length === 0 ? (
                <tr><td colSpan={visibleHeaders.length} className="px-5 py-8 text-center text-xs text-gray-400 dark:text-zinc-500">No loads match the current filter</td></tr>
              ) : filtered.map(load => (
                <tr key={load.id} className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors">
                  <td className={`px-5 ${py} text-xs font-semibold text-gray-700 dark:text-zinc-300`}>{load.load_number}</td>
                  {cfg.visibleCols.includes('route')   && <td className={`px-5 ${py} text-xs text-gray-500 dark:text-zinc-400`}>{load.shipper_address?.city} → {load.consignee_address?.city}</td>}
                  {cfg.visibleCols.includes('status')  && <td className={`px-5 ${py}`}><StatusBadge status={load.status} type="load" /></td>}
                  {cfg.visibleCols.includes('driver')  && <td className={`px-5 ${py} text-xs text-gray-500 dark:text-zinc-400`}>{load.driver ? `${load.driver.first_name} ${load.driver.last_name}` : '—'}</td>}
                  {cfg.visibleCols.includes('revenue') && <td className={`px-5 ${py} text-sm font-bold tabular-nums text-gray-900 dark:text-zinc-50`}>{formatCurrency(load.customer_rate)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cfg.showAlerts && (
        <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Action Required</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/60">
            {alerts.map(alert => {
              const Icon = alert.icon
              return (
                <div key={alert.id} className="flex gap-3.5 px-5 py-4 hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer">
                  <div className="mt-0.5 shrink-0 relative">
                    <Icon className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${priorityDot[alert.priority]}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 leading-snug">{alert.title}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 leading-snug">{alert.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 shadow-2xl text-xs space-y-2">
      <p className="text-gray-400 dark:text-zinc-500 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500 dark:text-zinc-400">{p.name}</span>
          </div>
          <span className="font-bold tabular-nums text-gray-900 dark:text-zinc-50">
            {p.name === 'Margin %' ? `${p.value}%` : formatCurrency(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Edit overlay ─────────────────────────────────────────────────────────────

function EditOverlay({ id, hidden, onToggle, onSettings }: {
  id: WidgetId; hidden: boolean; onToggle: () => void; onSettings: () => void
}) {
  const { label, hint } = WIDGET_META[id]
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className={cn('absolute inset-0 rounded-2xl z-10 flex items-center px-5 gap-4 border-2 border-dashed',
        hidden
          ? 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/60'
          : 'border-gray-300 dark:border-zinc-600 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-[3px]'
      )}
    >
      <GripVertical className="h-5 w-5 text-gray-300 dark:text-zinc-600 shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 leading-none">{label}</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 leading-none">{hint}</p>
      </div>
      <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onSettings() }}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors shrink-0"
      >
        <Settings2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Edit</span>
      </button>
      <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onToggle() }}
        className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0',
          hidden ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-gray-700' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400'
        )}
      >
        {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{hidden ? 'Show' : 'Hide'}</span>
      </button>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { darkMode } = useUIStore()
  const { user }     = useAuthStore()
  const navigate     = useNavigate()

  const green     = darkMode ? GREEN_DARK  : GREEN_LIGHT
  const gridColor = darkMode ? '#27272a'   : '#f3f4f6'
  const tickColor = darkMode ? '#71717a'   : '#9ca3af'
  const allLoads  = MOCK_LOADS.slice(0, 15)
  const firstName = user?.first_name ?? 'User'

  const [editMode,      setEditMode]      = useState(false)
  const [widgetOrder,   setWidgetOrder]   = useState<WidgetId[]>(DEFAULT_ORDER)
  const [hidden,        setHidden]        = useState<Set<WidgetId>>(new Set())
  const [draftOrder,    setDraftOrder]    = useState<WidgetId[]>(DEFAULT_ORDER)
  const [draftHidden,   setDraftHidden]   = useState<Set<WidgetId>>(new Set())
  const [configs,       setConfigs]       = useState<WidgetConfigs>(DEFAULT_CONFIGS)
  const [editingWidget, setEditingWidget] = useState<WidgetId | null>(null)

  function openEdit()  { setDraftOrder([...widgetOrder]); setDraftHidden(new Set(hidden)); setEditMode(true) }
  function saveEdit()  { setWidgetOrder([...draftOrder]); setHidden(new Set(draftHidden)); setEditMode(false); setEditingWidget(null) }
  function cancelEdit(){ setEditMode(false); setEditingWidget(null) }

  function toggleDraftHide(id: WidgetId) {
    setDraftHidden(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function updateConfig<K extends WidgetId>(id: K, patch: Partial<WidgetConfigs[K]>) {
    setConfigs(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }
  function resetConfig(id: WidgetId) {
    setConfigs(prev => ({ ...prev, [id]: DEFAULT_CONFIGS[id] }))
  }

  const activeOrder  = editMode ? draftOrder  : widgetOrder
  const activeHidden = editMode ? draftHidden : hidden

  function renderWidget(id: WidgetId) {
    if (id === 'kpis')   return <KPISection   cfg={configs.kpis} />
    if (id === 'chart')  return <ChartSection  cfg={configs.chart}  green={green} gridColor={gridColor} tickColor={tickColor} darkMode={darkMode} />
    if (id === 'bottom') return <BottomSection cfg={configs.bottom} allLoads={allLoads} />
    return null
  }

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight mb-1">{CURRENT_MONTH_LABEL}</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight leading-none">Welcome back, {firstName}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <AnimatePresence>
              {!editMode && QUICK_ACTIONS.map(({ label, icon: Icon, href, primary }) => (
                <motion.button key={label} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.12 }}
                  onClick={() => navigate(href)}
                  className={primary
                    ? 'flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-3.5 py-2 text-xs font-semibold hover:bg-gray-700 dark:hover:bg-zinc-200 transition-colors shadow-sm'
                    : 'flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 px-3.5 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors'
                  }
                >
                  <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
                </motion.button>
              ))}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.div key="done-cancel" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex items-center gap-2">
                  <button onClick={cancelEdit} className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 px-3.5 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <XIcon className="h-3.5 w-3.5" /><span className="hidden sm:inline">Cancel</span>
                  </button>
                  <button onClick={saveEdit} className="flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-3.5 py-2 text-xs font-semibold hover:bg-gray-700 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                    <Check className="h-3.5 w-3.5" /><span className="hidden sm:inline">Done</span>
                  </button>
                </motion.div>
              ) : (
                <motion.button key="edit-btn" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} onClick={openEdit}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 px-3.5 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <LayoutPanelTop className="h-3.5 w-3.5" /><span className="hidden sm:inline">Edit Widgets</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Edit hint */}
        <AnimatePresence>
          {editMode && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 px-4 py-2.5 flex items-center gap-2.5 text-xs text-gray-500 dark:text-zinc-400">
                <GripVertical className="h-3.5 w-3.5 shrink-0" />
                Drag to reorder · click <strong className="font-semibold text-gray-700 dark:text-zinc-300 mx-0.5">Edit</strong> to customise · toggle eye to show/hide
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Widgets */}
        <Reorder.Group axis="y" values={activeOrder} onReorder={editMode ? setDraftOrder : () => {}} className="space-y-6 list-none p-0 m-0">
          {activeOrder.map(id => {
            const isHidden = activeHidden.has(id)
            return (
              <Reorder.Item key={id} value={id} dragListener={editMode} layout className="relative"
                whileDrag={{ scale: 1.012, opacity: 0.96, zIndex: 50, cursor: 'grabbing' }}
                transition={{ layout: { type: 'spring', stiffness: 400, damping: 32 }, duration: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {isHidden ? (
                    <motion.div key="hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 72 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="relative rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/30 overflow-hidden"
                    >
                      <EditOverlay id={id} hidden onToggle={() => toggleDraftHide(id)} onSettings={() => setEditingWidget(id)} />
                    </motion.div>
                  ) : (
                    <motion.div key="visible" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="relative">
                      {renderWidget(id)}
                      <AnimatePresence>
                        {editMode && <EditOverlay id={id} hidden={false} onToggle={() => toggleDraftHide(id)} onSettings={() => setEditingWidget(id)} />}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </div>

      {/* Settings drawer */}
      <AnimatePresence>
        {editingWidget && (
          <SettingsDrawer widgetId={editingWidget} configs={configs} onUpdate={updateConfig} onClose={() => setEditingWidget(null)} onReset={resetConfig} />
        )}
      </AnimatePresence>
    </div>
  )
}
