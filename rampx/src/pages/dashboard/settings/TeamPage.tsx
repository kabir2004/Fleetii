import { motion } from 'framer-motion'
import { Plus, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/formatters'

const TEAM_MEMBERS = [
  { name: 'Alex Morgan', email: 'alex@northboundfreight.com', role: 'Owner', initials: 'AM' },
  { name: 'Jessica Park', email: 'jpark@northboundfreight.com', role: 'Admin', initials: 'JP' },
  { name: 'Chris Davis', email: 'cdavis@northboundfreight.com', role: 'Dispatcher', initials: 'CD' },
  { name: 'Rachel Kim', email: 'rkim@northboundfreight.com', role: 'Accountant', initials: 'RK' },
]

export default function TeamPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Team Members</CardTitle>
          <Button size="sm" className="gap-2"><Plus className="h-3.5 w-3.5" />Invite</Button>
        </CardHeader>
        <CardContent className="p-0">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.email}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800/50"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-sm">{member.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 dark:text-zinc-200">{member.name}</div>
                <div className="text-xs text-gray-500 dark:text-zinc-500">{member.email}</div>
              </div>
              <span className="text-xs text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{member.role}</span>
              {member.role !== 'Owner' && (
                <Button variant="ghost" size="sm" className="text-xs h-7 text-zinc-500">Remove</Button>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
