import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle, Truck, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 2000 / steps)
    return () => clearInterval(timer)
  }, [inView, target])
  const fmt = count >= 1_000_000 ? `${(count / 1_000_000).toFixed(1)}M`
    : count >= 1_000 ? `${(count / 1_000).toFixed(0)}K`
    : count.toString()
  return <span ref={ref} className="tabular-nums">{prefix}{fmt}{suffix}</span>
}

const LOGOS = ['Apex Freight', 'SunBelt Carriers', 'Great Plains Transport', 'Midwest Express', 'Coastal Logistics']

const TESTIMONIALS = [
  {
    quote: "Fleetii caught $84,000 in carrier overcharges in our first 90 days. It paid for itself in week two.",
    author: "Sarah Chen",
    role: "CFO",
    company: "Great Plains Transport",
    trucks: "180 trucks",
  },
  {
    quote: "We went from four tools to one. Our dispatchers love it. Our accountants love it. It just works.",
    author: "Marcus Johnson",
    role: "Owner",
    company: "Midwest Express LLC",
    trucks: "42 trucks",
  },
  {
    quote: "The freight audit alone saves us $6K a month. The reporting has given us margin visibility we never had.",
    author: "Elena Rodriguez",
    role: "VP Operations",
    company: "SunBelt Freight",
    trucks: "95 trucks",
  },
]

// Mini UI components for bento cards
function AuditMiniUI() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900">INV-2024-0391 · FastRoute Carrier</span>
        <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">2 issues</span>
      </div>
      <div className="space-y-2">
        <div className="rounded-lg bg-red-50 border border-red-100 p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-gray-700 mb-0.5">Line haul rate</div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-green-700 font-semibold">$5.19/mi</span>
                <span className="text-gray-300">→</span>
                <span className="text-red-600 font-semibold">$5.90/mi</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-700 mb-0.5">Recovery</div>
              <div className="text-green-700 font-bold text-sm">+$655.74</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-100 p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-gray-700 mb-0.5">Detention fee</div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-green-700 font-semibold">Not approved</span>
                <span className="text-gray-300">→</span>
                <span className="text-red-600 font-semibold">$230.00</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-700 mb-0.5">Recovery</div>
              <div className="text-green-700 font-bold text-sm">+$230.00</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-gray-800">Total identified</span>
        <span className="text-green-700 font-bold text-base">$885.74</span>
      </div>
    </div>
  )
}

function SpendMiniUI() {
  const bars = [42, 58, 51, 74, 63, 82, 70, 91]
  return (
    <div className="p-5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-gray-900">Freight spend</span>
        <span className="font-mono text-sm font-bold text-gray-900">$934K <span className="text-green-700 text-xs">↓ 3.2%</span></span>
      </div>
      <div className="text-xs text-gray-600 mb-4">vs last month</div>
      <div className="flex items-end gap-1.5 h-24">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-sm ${i === bars.length - 1 ? 'bg-green-600' : 'bg-gray-200'}`}
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map(m => (
          <span key={m} className="text-[10px] text-gray-600 flex-1 text-center">{m}</span>
        ))}
      </div>
    </div>
  )
}

function PaymentsMiniUI() {
  return (
    <div className="p-5 space-y-2">
      <div className="text-sm font-semibold text-gray-900 mb-3">Pending approvals</div>
      {[
        { carrier: 'FastRoute Carrier', amount: '$4,280', status: 'Approved', color: 'text-green-700 bg-green-50 border-green-100' },
        { carrier: 'Apex Logistics', amount: '$6,150', status: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-100' },
        { carrier: 'SunBelt Haul', amount: '$2,890', status: 'Approved', color: 'text-green-700 bg-green-50 border-green-100' },
      ].map((p, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <div>
            <div className="text-sm font-semibold text-gray-900">{p.carrier}</div>
            <div className="font-mono text-xs text-gray-700">{p.amount}</div>
          </div>
          <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${p.color}`}>{p.status}</span>
        </div>
      ))}
    </div>
  )
}

function ComplianceMiniUI() {
  return (
    <div className="p-5 space-y-2">
      <div className="text-sm font-semibold text-gray-900 mb-3">Upcoming renewals</div>
      {[
        { doc: 'CDL · D. Martinez', days: '12 days', color: 'text-red-600 bg-red-50 border-red-100' },
        { doc: 'Vehicle Reg. #T-042', days: '28 days', color: 'text-amber-600 bg-amber-50 border-amber-100' },
        { doc: 'DOT Insurance', days: '67 days', color: 'text-green-700 bg-green-50 border-green-100' },
      ].map((c, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <div className="text-sm font-semibold text-gray-900">{c.doc}</div>
          <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${c.color}`}>{c.days}</span>
        </div>
      ))}
    </div>
  )
}

const BENTO = [
  {
    label: 'Freight Audit',
    title: 'Every invoice, automatically checked.',
    description: 'Fleetii compares every line against your contracted rates and disputes discrepancies before you pay. Average recovery: $47K/year.',
    span: 'col-span-2',
    MiniUI: AuditMiniUI,
  },
  {
    label: 'Spend Intelligence',
    title: 'Know where every dollar goes.',
    description: 'Spend broken down by lane, carrier, driver, and vehicle. Make margin decisions backed by data.',
    span: 'col-span-1',
    MiniUI: SpendMiniUI,
  },
  {
    label: 'Carrier Payments',
    title: 'Pay carriers in one click.',
    description: 'ACH payments with approval workflows and a full audit trail on every transaction.',
    span: 'col-span-1',
    MiniUI: PaymentsMiniUI,
  },
  {
    label: 'Fleet Management',
    title: 'One view of your entire fleet.',
    description: 'Real-time GPS, maintenance scheduling, driver HOS, and compliance in one place.',
    span: 'col-span-1',
    icon: Truck,
  },
  {
    label: 'Compliance & Docs',
    title: 'Never miss a renewal.',
    description: 'Automatic alerts for CDLs, insurance, registrations, and FMCSA deadlines. Every document in one vault.',
    span: 'col-span-1',
    MiniUI: ComplianceMiniUI,
  },
]

export default function LandingPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 font-medium mb-10 tracking-tight">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Now in beta. 500+ fleets enrolled.
          </div>

          <h1 className="text-[40px] sm:text-[56px] md:text-[68px] lg:text-[88px] font-bold text-gray-950 leading-[0.95] tracking-[-0.04em] mb-7">
            Freight finance<br />
            <span className="text-green-700">for trucking.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto mb-10 leading-relaxed">
            Audit freight invoices, pay carriers, and track spend. Built for trucking companies of every size.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button asChild className="h-11 px-5 rounded-xl bg-gray-950 text-white hover:bg-gray-800 font-semibold text-sm gap-2 shadow-sm">
              <Link to="/signup">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-gray-800 font-semibold text-sm">
              <Link to="/login">Book a demo</Link>
            </Button>
          </div>
        </motion.div>

        {/* Platform Bento */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-3 mt-16"
          style={{ gridAutoRows: 'auto' }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          {/* Tile A — Freight Audit (large, 2×2) */}
          <div className="md:col-span-2 md:row-span-2 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col text-left shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-900 tracking-tight">Freight Audit</span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">2 flagged</span>
            </div>
            <div className="text-xs text-gray-700 font-medium mb-3">INV-2024-0391 · FastRoute Carrier</div>
            <div className="space-y-2 flex-1">
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-800">Line haul rate</span>
                  <span className="font-mono text-xs font-bold text-green-700">+$655.74</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-green-700 font-semibold">$5.19/mi</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-red-600 font-semibold">$5.90/mi</span>
                </div>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-800">Detention fee</span>
                  <span className="font-mono text-xs font-bold text-green-700">+$230.00</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-green-700 font-semibold">Not approved</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-red-600 font-semibold">$230.00</span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-800">Fuel surcharge</span>
                  <span className="text-xs font-semibold text-green-700">✓ Correct</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-gray-700">$0.48/mi</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-gray-700">$0.48/mi</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 border border-green-100 px-3 py-2.5">
              <span className="text-xs font-semibold text-gray-800">Total recovery</span>
              <span className="font-mono text-sm font-bold text-green-700">$885.74</span>
            </div>
          </div>

          {/* Tile B — Savings KPI */}
          <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col text-left shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]">
            <span className="text-sm font-bold text-gray-900 tracking-tight mb-3">Savings found</span>
            <div className="font-mono text-3xl font-bold text-gray-950 tracking-tight mt-auto">$22.1K</div>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-xs font-semibold text-green-700">↑ 34%</span>
              <span className="text-xs text-gray-700">vs last month</span>
            </div>
          </div>

          {/* Tile C — Spend Chart */}
          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col text-left shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-gray-900 tracking-tight">Freight Spend</span>
              <span className="font-mono text-sm font-bold text-gray-900">$934K</span>
            </div>
            <span className="text-xs text-gray-700 mb-4">Last 8 months</span>
            <div className="flex items-end gap-1.5 flex-1">
              {[40, 55, 48, 70, 60, 82, 73, 93].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-green-600' : 'bg-gray-200'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {['F', 'M', 'A', 'M', 'J', 'J', 'A', 'S'].map((m, i) => (
                <span key={i} className="flex-1 text-center text-[10px] text-gray-600 font-medium">{m}</span>
              ))}
            </div>
          </div>

          {/* Tile D — Active Loads */}
          <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col text-left shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]">
            <span className="text-sm font-bold text-gray-900 tracking-tight mb-3">Active Loads</span>
            <div className="font-mono text-3xl font-bold text-gray-950 tracking-tight mt-auto mb-3">53</div>
            <div className="space-y-1.5">
              {[
                { label: 'In transit', n: 31, color: 'bg-blue-500' },
                { label: 'Dispatched', n: 14, color: 'bg-indigo-400' },
                { label: 'At delivery', n: 8, color: 'bg-violet-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.color}`} />
                  <span className="text-xs text-gray-700 flex-1">{s.label}</span>
                  <span className="font-mono text-xs font-bold text-gray-900">{s.n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tile E — Payments Queue */}
          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col text-left shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]">
            <span className="text-sm font-bold text-gray-900 tracking-tight mb-4">Carrier Payments</span>
            <div className="space-y-2 flex-1">
              {[
                { carrier: 'FastRoute Carrier', amount: '$4,280', status: 'Approved', sc: 'text-green-700 bg-green-50 border-green-100' },
                { carrier: 'Apex Logistics', amount: '$6,150', status: 'Pending', sc: 'text-amber-700 bg-amber-50 border-amber-100' },
                { carrier: 'SunBelt Haul Co.', amount: '$2,890', status: 'Approved', sc: 'text-green-700 bg-green-50 border-green-100' },
              ].map(p => (
                <div key={p.carrier} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{p.carrier}</div>
                    <div className="font-mono text-xs text-gray-700 mt-0.5">{p.amount}</div>
                  </div>
                  <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${p.sc}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Logos ── */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <span className="text-sm font-semibold text-gray-700 tracking-tight mr-2">Trusted by</span>
            {LOGOS.map(name => (
              <span key={name} className="text-sm font-bold text-gray-600 tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Features ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 tracking-tight leading-[1.05] max-w-lg">
              Everything your fleet's finances need.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENTO.map((card, i) => {
              const isFirst = i === 0
              return (
                <motion.div
                  key={card.label}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  {/* Mini UI preview */}
                  {card.MiniUI ? (
                    <div className={`border-b border-gray-100 bg-gray-50/80 ${isFirst ? 'min-h-[180px]' : 'min-h-[160px]'}`}>
                      <card.MiniUI />
                    </div>
                  ) : card.icon ? (
                    <div className="border-b border-gray-100 bg-gray-50/80 min-h-[160px] flex items-center justify-center">
                      <div className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <card.icon className="h-6 w-6 text-gray-700" />
                      </div>
                    </div>
                  ) : null}

                  {/* Text */}
                  <div className="p-5 flex-1">
                    <div className="text-xs font-bold text-green-700 tracking-tight mb-2">{card.label}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{card.title}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Audit Deep Dive ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-950 tracking-tight mb-5 leading-tight">
              Automated invoice auditing.
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-[15px]">
              Auditing hundreds of invoices a month manually is not practical. Fleetii does it automatically, comparing every line against your contracted rates and flagging discrepancies before you approve payment.
            </p>
            <div className="space-y-3">
              {[
                'Rate discrepancies vs contracted tariffs',
                'Unauthorized accessorial charges',
                'Duplicate invoice detection',
                'Wrong weight or mileage calculations',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
              <DollarSign className="h-4 w-4 text-green-700" />
              <span className="text-sm font-semibold text-green-800">Average customer recovery: <span className="font-bold">$47,000/year</span></span>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">INV-2024-0391</div>
                <div className="text-xs text-gray-700 mt-0.5">FastRoute Carrier · Submitted Sep 12</div>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">2 issues · $885 flagged</span>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-gray-700 tracking-tight px-1 mb-1">
                <span className="col-span-2">Line item</span>
                <span className="text-right">Contracted</span>
                <span className="text-right">Billed</span>
              </div>

              {[
                { item: 'Line haul (922 mi)', contracted: '$5.19/mi', billed: '$5.90/mi', flag: true, recovery: '$655.74' },
                { item: 'Fuel surcharge', contracted: '$0.48/mi', billed: '$0.48/mi', flag: false, recovery: null },
                { item: 'Detention (2 hrs)', contracted: 'Not approved', billed: '$230.00', flag: true, recovery: '$230.00' },
              ].map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-2 md:grid-cols-4 gap-3 items-center rounded-xl p-3 text-xs ${
                    row.flag ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <span className="col-span-2 font-medium text-gray-900">{row.item}</span>
                  <span className="font-mono text-right text-green-700 font-semibold">{row.contracted}</span>
                  <div className="text-right">
                    <span className={`font-mono font-semibold ${row.flag ? 'text-red-600' : 'text-gray-800'}`}>{row.billed}</span>
                    {row.flag && (
                      <div className="text-xs text-green-700 font-bold mt-0.5">+{row.recovery}</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 mt-2">
                <span className="text-sm font-semibold text-gray-900">Total recovery identified</span>
                <span className="font-mono text-lg font-bold text-green-700">$885.74</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button className="flex-1 h-9 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Dispute charges
                </button>
                <button className="flex-1 h-9 rounded-xl border border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Approve adjusted
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { target: 847, prefix: '$', suffix: 'M', label: 'Freight audited', sub: 'Across all active accounts' },
              { target: 47, prefix: '$', suffix: 'K', label: 'Average annual recovery', sub: 'Per fleet, from overcharges identified' },
              { target: 12400, prefix: '', suffix: '', label: 'Invoices processed monthly', sub: 'Fully automated, zero manual review' },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="px-4 sm:px-8 md:px-10 py-10 first:pl-0 last:pr-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="font-mono text-5xl font-bold text-gray-950 tracking-tight mb-2">
                  <AnimatedCounter target={s.target} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-base font-semibold text-gray-900 mb-1">{s.label}</div>
                <div className="text-sm text-gray-700">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-950 tracking-tight leading-[1.05]">
            What our customers say.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-7 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <p className="text-gray-800 leading-relaxed flex-1 mb-8 text-[15px]">
                "{t.quote}"
              </p>
              <div className="border-t border-gray-100 pt-5">
                <div className="text-sm font-bold text-gray-900">{t.author}</div>
                <div className="text-xs text-gray-700 mt-0.5">{t.role}, {t.company}</div>
                <div className="inline-flex items-center gap-1 mt-3 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1">
                  <Truck className="h-3 w-3 text-gray-700" />
                  <span className="text-xs font-semibold text-gray-700">{t.trucks}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-950 tracking-tight leading-[1.05] max-w-lg">
                Get started with Fleetii.
              </h2>
              <p className="text-gray-700 mt-4 text-[15px] max-w-md leading-relaxed">
                Connect your carrier invoices and get a full audit report within 24 hours. No credit card required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild className="h-11 px-6 rounded-xl bg-gray-950 text-white hover:bg-gray-800 font-semibold text-sm gap-2">
                <Link to="/signup">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 px-6 rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-gray-800 font-semibold text-sm">
                <Link to="/login">Book a demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
