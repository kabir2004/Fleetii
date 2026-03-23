import { motion } from 'framer-motion'
import { Truck, Shield, Zap } from 'lucide-react'

const VALUES = [
  {
    icon: Truck,
    title: 'Built for trucking',
    desc: 'Every feature is designed by former trucking operators who lived the pain of freight billing, carrier payments, and compliance firsthand.',
  },
  {
    icon: Shield,
    title: 'Finance-first',
    desc: 'Unlike traditional TMS software, Fleetii puts financial operations at the center. Every action connects back to your P&L.',
  },
  {
    icon: Zap,
    title: 'Automated by default',
    desc: 'Manual freight audit is a full-time job. We automate it completely so your team can focus on what actually moves the business forward.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-950 tracking-tight mb-6 leading-[1.05] max-w-2xl">
            About Fleetii.
          </h1>
          <p className="text-lg text-gray-500 mb-20 max-w-2xl leading-relaxed">
            We're building financial software for trucking companies, an industry that has been underserved by software for decades.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {VALUES.map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-7"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="h-9 w-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
                  <item.icon className="h-4.5 w-4.5 text-green-700" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-10">
              <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">Our mission</h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-[15px]">
                Trucking companies are run by people who are experts in logistics, not financial systems. Most fleets still rely on spreadsheets and disconnected tools to manage invoices, payments, and spend.
              </p>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Fleetii gives every fleet the financial tooling that used to require a dedicated finance team, from a single owner-operator to a 500-truck carrier.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {[
                { value: '$800B', label: 'Total US freight market', sub: 'Largely still managed on spreadsheets' },
                { value: '8.5%', label: 'Average carrier overbilling rate', sub: 'Industry-wide, per freight audit studies' },
                { value: '$47K', label: 'Average Fleetii customer recovery', sub: 'Per fleet, per year in identified overcharges' },
              ].map(s => (
                <div key={s.value} className="flex-1 rounded-2xl border border-gray-200 bg-white px-7 py-5 flex items-center gap-5">
                  <div className="font-mono text-3xl font-bold text-gray-950 tracking-tight shrink-0 w-20">{s.value}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{s.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
