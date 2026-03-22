import { motion } from 'framer-motion'
import { DollarSign, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, getInitials } from '@/lib/formatters'
import { MOCK_DRIVERS } from '@/lib/mockData'

export default function DriverPayPage() {
  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Driver Pay</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Settlements and pay stubs — March 2024</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export All</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Total Driver Pay (MTD)</div>
          <div className="font-numeric text-2xl font-bold text-gray-900 dark:text-zinc-50">{formatCurrency(14284)}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <div className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Avg Pay Per Driver</div>
          <div className="font-numeric text-2xl font-bold text-gray-900 dark:text-zinc-50">{formatCurrency(2857)}</div>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
          <div className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Pending Settlements</div>
          <div className="font-numeric text-2xl font-bold text-green-400">3</div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Current Pay Period</CardTitle>
          <span className="text-xs text-gray-400 dark:text-zinc-500">Mar 1 – Mar 21, 2024</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800">
                {['Driver', 'Status', 'Loads', 'Miles', 'Pay Rate', 'Gross Pay', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_DRIVERS.map((driver, i) => {
                const grossPay = (driver.ytd_miles ?? 0) / 12 * (driver.pay_rate ?? 0)
                return (
                  <motion.tr
                    key={driver.id}
                    className="border-b border-gray-200/50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/30"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">{getInitials(driver.first_name, driver.last_name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700 dark:text-zinc-200">{driver.first_name} {driver.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={driver.status} type="driver" /></td>
                    <td className="px-4 py-3 text-sm font-numeric text-gray-500 dark:text-zinc-400">{Math.floor(Math.random() * 5) + 2}</td>
                    <td className="px-4 py-3 text-sm font-numeric text-gray-500 dark:text-zinc-400">{Math.floor((driver.ytd_miles ?? 0) / 12).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-numeric text-gray-500 dark:text-zinc-400">${driver.pay_rate?.toFixed(2)}/mi</td>
                    <td className="px-4 py-3 text-sm font-numeric font-semibold text-green-400">{formatCurrency(grossPay)}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                        <DollarSign className="h-3 w-3" />Pay
                      </Button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table></div>
        </CardContent>
      </Card>
    </div>
  )
}
