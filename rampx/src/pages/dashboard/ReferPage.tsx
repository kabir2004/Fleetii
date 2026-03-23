import { motion } from 'framer-motion'
import { Gift, Copy, Share2, DollarSign, Users, CheckCircle2 } from 'lucide-react'

const STAGGER = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

const REFERRALS = [
  { name: 'Atlas Freight LLC',     status: 'signed_up',   reward: '$500',  date: 'Mar 12, 2024' },
  { name: 'Irongate Carriers Inc.',status: 'pending',      reward: '$500',  date: 'Mar 8, 2024'  },
  { name: 'Summit Transport Co.',  status: 'signed_up',   reward: '$500',  date: 'Feb 28, 2024' },
]

const statusLabel: Record<string, { label: string; cls: string }> = {
  signed_up: { label: 'Signed Up',  cls: 'bg-[#C8F400]/20 text-[#2D6A4F] dark:text-[#C8F400]' },
  pending:   { label: 'Pending',    cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
}

export default function ReferPage() {
  return (
    <div className="p-4 md:p-6 w-full max-w-2xl">
      <motion.div variants={STAGGER.container} initial="initial" animate="animate" className="space-y-8">

        {/* Header */}
        <motion.div variants={STAGGER.item}>
          <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Rewards</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Refer &amp; Earn</h1>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          variants={STAGGER.item}
          className="rounded-2xl bg-[#C8F400] p-8 relative overflow-hidden"
        >
          <div className="absolute right-6 top-4 opacity-10">
            <Gift className="h-32 w-32 text-zinc-900" />
          </div>
          <p className="text-sm font-semibold text-zinc-700 uppercase tracking-widest mb-2">For every carrier you refer</p>
          <p className="text-5xl font-black text-zinc-900 tracking-tight mb-1">$500</p>
          <p className="text-sm text-zinc-700">credited to your account when they sign up and process their first load.</p>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          variants={STAGGER.item}
          className="flex flex-wrap items-start gap-x-12 gap-y-6 border-b border-gray-100 dark:border-zinc-800 pb-8"
        >
          {[
            { label: 'Total Earned',    value: '$1,000', sub: '2 successful referrals' },
            { label: 'Pending Rewards', value: '$500',   sub: '1 signup in progress'   },
            { label: 'Referral Code',   value: 'FLT-7X2',sub: 'Share with carriers'    },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
              <p className="text-3xl font-bold tabular-nums tracking-tight mt-1 text-gray-900 dark:text-zinc-50">{value}</p>
              {sub && <p className="text-xs mt-0.5 text-gray-400 dark:text-zinc-500">{sub}</p>}
            </div>
          ))}
        </motion.div>

        {/* Referral Link */}
        <motion.div variants={STAGGER.item}>
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-3">Your referral link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 px-3 py-2.5">
              <span className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                https://fleetii.app/ref/FLT-7X2
              </span>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors shrink-0">
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shrink-0">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div variants={STAGGER.item}>
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-4">How it works</p>
          <div className="space-y-3">
            {[
              { step: '1', icon: Share2,      text: 'Share your unique referral link with another carrier or fleet operator.' },
              { step: '2', icon: Users,       text: 'They sign up for Fleetii using your link.' },
              { step: '3', icon: DollarSign,  text: 'Once they process their first load, $500 is credited to your account.' },
              { step: '4', icon: CheckCircle2,text: 'No limit — refer as many carriers as you want.' },
            ].map(({ step, icon: Icon, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">{step}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Past Referrals */}
        {REFERRALS.length > 0 && (
          <motion.div variants={STAGGER.item}>
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-3">Your referrals</p>
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
              {REFERRALS.map(r => (
                <div key={r.name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">{r.name}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${statusLabel[r.status].cls}`}>
                      {statusLabel[r.status].label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{r.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
