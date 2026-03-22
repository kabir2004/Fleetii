import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Package, FileText, AlertTriangle, Fuel, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { MOCK_NOTIFICATIONS } from '@/lib/mockData'
import { formatRelativeTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<string, React.ElementType> = {
  invoice_overdue: FileText,
  invoice_disputed: FileText,
  doc_expiring: AlertTriangle,
  maintenance_due: Wrench,
  fuel_flagged: Fuel,
  load_delivered: Package,
}

export function NotificationPanel() {
  const { notificationPanelOpen, setNotificationPanelOpen } = useUIStore()

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationPanelOpen(false)}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-zinc-400" />
                <h3 className="font-semibold text-zinc-100">Notifications</h3>
                <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5">
                  {MOCK_NOTIFICATIONS.filter(n => !n.read).length} new
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setNotificationPanelOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((notif, i) => {
                const IconComp = TYPE_ICONS[notif.type] ?? Bell
                return (
                  <motion.a
                    key={notif.id}
                    href={notif.action_url}
                    className={cn(
                      'flex gap-3 p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors',
                      !notif.read && 'bg-zinc-800/20'
                    )}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                      notif.read ? 'bg-zinc-800' : 'bg-zinc-700'
                    )}>
                      <IconComp className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm font-medium', notif.read ? 'text-zinc-400' : 'text-zinc-100')}>
                          {notif.title}
                          {!notif.read && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-400" />}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-zinc-600 mt-1">{formatRelativeTime(notif.created_at)}</p>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            <div className="p-4 border-t border-zinc-800">
              <Button variant="ghost" size="sm" className="w-full text-zinc-400">
                Mark all as read
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
