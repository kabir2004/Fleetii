import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { CURRENT_MONTH_LABEL } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import {
  Shield, DollarSign, Zap, FileCheck,
  ArrowRight, CheckCircle2, AlertCircle, AlertTriangle,
} from 'lucide-react'

/* ── data ─────────────────────────────────────────────────────────────────── */

const OVERALL_SCORE = 84

const SCORE_HISTORY = [
  { month: 'Oct', score: 76 },
  { month: 'Nov', score: 78 },
  { month: 'Dec', score: 79 },
  { month: 'Jan', score: 81 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 84 },
]

const PILLARS = [
  {
    id:          'safety',
    label:       'Safety',
    icon:        Shield,
    score:       91,
    delta:       +2,
    tier:        'Excellent',
    tierColor:   'text-green-600',
    description: 'Driver safety scores, HOS compliance, incident rate',
    breakdown: [
      { metric: 'Fleet Avg Safety Score', value: '9.2/10',  status: 'good'   },
      { metric: 'HOS Violations (30d)',   value: '0',        status: 'good'   },
      { metric: 'Incidents YTD',          value: '2',        status: 'warn'   },
      { metric: 'Drivers at Risk',        value: '0',        status: 'good'   },
    ],
  },
  {
    id:          'finance',
    label:       'Financial Health',
    icon:        DollarSign,
    score:       82,
    delta:       +3,
    tier:        'Good',
    tierColor:   'text-blue-600',
    description: 'Gross margin, cash flow, outstanding A/R aging',
    breakdown: [
      { metric: 'Gross Margin (MTD)',    value: '25.1%',     status: 'good'   },
      { metric: 'A/R Over 60 Days',     value: '$28,400',   status: 'warn'   },
      { metric: 'Net Cash Flow (MTD)',  value: '+$313K',    status: 'good'   },
      { metric: 'Invoice Dispute Rate', value: '8.3%',      status: 'warn'   },
    ],
  },
  {
    id:          'operations',
    label:       'Operations',
    icon:        Zap,
    score:       88,
    delta:       +1,
    tier:        'Good',
    tierColor:   'text-blue-600',
    description: 'On-time delivery, fleet utilization, load completion',
    breakdown: [
      { metric: 'On-Time Delivery',       value: '91.2%',   status: 'good'   },
      { metric: 'Fleet Utilization',      value: '76%',     status: 'warn'   },
      { metric: 'Load Completion Rate',   value: '98.6%',   status: 'good'   },
      { metric: 'Avg Miles/Truck/Month',  value: '12,400',  status: 'good'   },
    ],
  },
  {
    id:          'compliance',
    label:       'Compliance',
    icon:        FileCheck,
    score:       74,
    delta:       -1,
    tier:        'Needs Work',
    tierColor:   'text-amber-600',
    description: 'Document expiry, CDL renewals, insurance coverage',
    breakdown: [
      { metric: 'Docs Expiring (60d)',   value: '3',        status: 'error'  },
      { metric: 'CDLs Expiring (90d)',   value: '2',        status: 'warn'   },
      { metric: 'Insurance Coverage',   value: 'Active',   status: 'good'   },
      { metric: 'Drug Test Currency',   value: 'Current',  status: 'good'   },
    ],
  },
]

const ACTIONS = [
  { priority: 'high',   pillar: 'Compliance', action: "Renew Sandra Chen's CDL — expires Dec 1, 2025",       impact: '+4 pts' },
  { priority: 'high',   pillar: 'Compliance', action: 'Upload updated insurance certificate for T-103',       impact: '+3 pts' },
  { priority: 'medium', pillar: 'Finance',    action: 'Follow up on $28,400 in A/R over 60 days',            impact: '+3 pts' },
  { priority: 'medium', pillar: 'Operations', action: 'Improve fleet utilization — 2 trucks under 65%',       impact: '+2 pts' },
  { priority: 'medium', pillar: 'Finance',    action: 'Resolve 3 invoices currently in "Disputed" status',   impact: '+2 pts' },
  { priority: 'low',    pillar: 'Safety',     action: 'Schedule refresher training for Derek Johnson (8.8)',  impact: '+1 pt'  },
]

function PriorityIcon({ priority }: { priority: string }) {
  if (priority === 'high')   return <AlertCircle   className="h-4 w-4 text-red-500 shrink-0"   />
  if (priority === 'medium') return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
  return                            <CheckCircle2  className="h-4 w-4 text-blue-400 shrink-0"  />
}

function BreakdownStatus({ status }: { status: string }) {
  if (status === 'good')  return <CheckCircle2  className="h-3.5 w-3.5 text-green-500 shrink-0" />
  if (status === 'warn')  return <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
  return                         <AlertCircle   className="h-3.5 w-3.5 text-red-500 shrink-0"   />
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const { darkMode } = useUIStore()
  const r = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#3b82f6' : '#f59e0b'
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={darkMode ? '#27272a' : '#f3f4f6'} strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1">{label}</p>
      <p className="font-bold text-gray-900 dark:text-zinc-50">{payload[0].value}/100</p>
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function HealthScorePage() {
  const { darkMode } = useUIStore()
  const green     = darkMode ? '#C8F400' : '#2D6A4F'
  const gridColor = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor = darkMode ? '#71717a' : '#9ca3af'

  const prevScore = SCORE_HISTORY[4].score
  const scoreDelta = OVERALL_SCORE - prevScore
  const [actionFilter, setActionFilter] = useState<'all' | 'high'>('all')
  const visibleActions = actionFilter === 'high'
    ? ACTIONS.filter(a => a.priority === 'high')
    : ACTIONS

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Fleet Health Score</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActionFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              actionFilter === 'all'
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
            )}
          >
            All Actions
          </button>
          <button
            onClick={() => setActionFilter('high')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              actionFilter === 'high'
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-50'
                : 'border-gray-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900'
            )}
          >
            High Priority
          </button>
        </div>
      </div>

      {/* Hero score banner */}
      <motion.div
        className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">

          {/* Score ring */}
          <div className="relative shrink-0">
            <ScoreRing score={OVERALL_SCORE} size={120} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-gray-900 dark:text-zinc-50">{OVERALL_SCORE}</span>
              <span className="text-xs text-gray-400 dark:text-zinc-500">/100</span>
            </div>
          </div>

          {/* Score context */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
              <p className="text-xl font-bold text-gray-900 dark:text-zinc-50">Northbound Freight LLC</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] dark:bg-[#C8F400]/10 dark:text-[#C8F400] border border-[#2D6A4F]/20 dark:border-[#C8F400]/20">
                Pro Fleet
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mb-3">
              Your fleet scores <strong className="text-gray-700 dark:text-zinc-300">Good</strong> overall — above the industry median of 71 for carriers your size.
              Address compliance gaps to push into the <strong className="text-gray-700 dark:text-zinc-300">Excellent</strong> tier (90+).
            </p>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-sm">
                <span className={cn('font-semibold', scoreDelta > 0 ? 'text-emerald-600' : 'text-red-500')}>
                  {scoreDelta > 0 ? '+' : ''}{scoreDelta} pts
                </span>
                <span className="text-gray-400 dark:text-zinc-500">vs last month</span>
              </div>
              <span className="text-xs text-gray-300 dark:text-zinc-600">·</span>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Updated {CURRENT_MONTH_LABEL}</p>
            </div>
          </div>

          {/* Score tiers legend */}
          <div className="sm:ml-auto flex flex-col gap-2 shrink-0">
            {[
              { tier: 'Excellent', range: '90–100', color: 'bg-green-500'  },
              { tier: 'Good',      range: '70–89',  color: 'bg-blue-500'   },
              { tier: 'Fair',      range: '50–69',  color: 'bg-amber-400'  },
              { tier: 'Poor',      range: '< 50',   color: 'bg-red-500'    },
            ].map(({ tier, range, color }) => (
              <div key={tier} className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full shrink-0', color)} />
                <span className="text-xs text-gray-500 dark:text-zinc-400">{tier}</span>
                <span className="text-xs text-gray-300 dark:text-zinc-600 ml-auto pl-4">{range}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Four pillar cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon
          return (
            <motion.div
              key={pillar.id}
              className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07 }}
            >
              {/* Pillar header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{pillar.label}</p>
                    <span className={cn('text-xs font-medium', pillar.tierColor)}>{pillar.tier}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-zinc-50">{pillar.score}</p>
                  <p className={cn('text-xs font-semibold',
                    pillar.delta > 0 ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {pillar.delta > 0 ? '+' : ''}{pillar.delta} pts
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pillar.score}%` }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6 }}
                  style={{
                    background: pillar.score >= 85 ? '#22c55e' : pillar.score >= 70 ? '#3b82f6' : '#f59e0b'
                  }}
                />
              </div>

              {/* Breakdown metrics */}
              <div className="space-y-2.5">
                {pillar.breakdown.map(({ metric, value, status }) => (
                  <div key={metric} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BreakdownStatus status={status} />
                      <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">{metric}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-50 tabular-nums shrink-0">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Score trend + action list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Score trend chart */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">Score History</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Oct 2023 – Mar 2024 · composite score</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SCORE_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: -10 }}>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
                domain={[60, 100]} width={32} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Line type="monotone" dataKey="score" stroke={green} strokeWidth={2.5}
                dot={{ fill: green, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: green, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recommended actions */}
        <motion.div
          className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Recommended Actions</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
              Complete these to improve your health score · potential +{ACTIONS.reduce((s, a) => s + parseInt(a.impact), 0)} pts
            </p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {visibleActions.map((action, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.24 + i * 0.04 }}
              >
                <PriorityIcon priority={action.priority} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-zinc-200 leading-snug">{action.action}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{action.pillar}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-600 tabular-nums">{action.impact}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 dark:text-zinc-600 group-hover:text-gray-500 dark:group-hover:text-zinc-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  )
}
