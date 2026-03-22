import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-2xl font-bold text-zinc-50 tracking-tight"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Ramp<span className="text-green-400">X</span>
        </motion.div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-green-500"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
