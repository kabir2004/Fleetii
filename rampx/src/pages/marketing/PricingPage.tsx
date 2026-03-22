import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    name: 'Starter',
    price: 299,
    description: 'For small carriers getting their financial operations in order.',
    features: [
      'Up to 10 trucks',
      'Freight audit, up to 100 invoices/mo',
      'Basic load management',
      'Driver management',
      '2 users',
      'Email support',
    ],
    cta: 'Get started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: 799,
    description: 'For growing fleets that need the full financial stack.',
    features: [
      'Up to 50 trucks',
      'Unlimited freight audit',
      'Advanced load board',
      'Carrier payments & AP',
      'Fuel card analytics',
      'Lane & carrier analytics',
      '10 users',
      'Priority support',
    ],
    cta: 'Get started',
    href: '/signup',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For large fleets and brokerages with complex multi-entity needs.',
    features: [
      'Unlimited trucks',
      'Custom integrations',
      'Multi-entity support',
      'Dedicated account manager',
      'Custom reporting & SLA',
      'Unlimited users',
      'White-glove onboarding',
    ],
    cta: 'Contact sales',
    href: '#',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="bg-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-5xl font-bold text-gray-950 tracking-tight mb-4">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Most customers recover more in freight overcharges within the first 90 days than they spend on the subscription.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? 'bg-gray-950 border-gray-950 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {plan.popular && (
                <div className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-3 py-1 w-fit mb-5 uppercase tracking-widest">
                  Most popular
                </div>
              )}

              <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-8 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className="mb-8">
                {plan.price ? (
                  <div className="flex items-baseline gap-1">
                    <span className={`font-mono text-4xl font-bold tracking-tight ${plan.popular ? 'text-white' : 'text-gray-950'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`}>/month</span>
                  </div>
                ) : (
                  <span className={`font-mono text-4xl font-bold tracking-tight ${plan.popular ? 'text-white' : 'text-gray-950'}`}>
                    Custom
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.popular ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full h-10 rounded-xl font-semibold text-sm ${
                  plan.popular
                    ? 'bg-white text-gray-950 hover:bg-gray-100'
                    : 'bg-gray-950 text-white hover:bg-gray-800'
                }`}
                variant="ghost"
              >
                <Link to={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ nudge */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            All plans include a 14-day free trial. No credit card required.{' '}
            <a href="#" className="text-gray-900 font-semibold hover:underline underline-offset-2">
              Compare all features →
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
