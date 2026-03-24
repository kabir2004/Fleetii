import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex">

      {/* Left — mantra panel */}
      <div className="hidden lg:flex w-[440px] shrink-0 bg-black flex-col p-12">
        <Link to="/" className="flex items-center gap-3">
          <img src="/fleettiilogodark-removebg-preview.png" alt="Fleetii" className="h-12 object-contain" />
          <span className="text-2xl font-bold text-white tracking-tight">Fleetii</span>
        </Link>

        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-3xl font-bold text-white leading-tight tracking-tight">
            What gets measured<br />must be managed.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[360px]">
          <Link to="/" className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <img src="/fleetiilogolight-removebg-preview.png" alt="Fleetii" className="h-12 object-contain" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Fleetii</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>

    </div>
  )
}
