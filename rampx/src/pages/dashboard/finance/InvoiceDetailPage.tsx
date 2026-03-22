import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { MOCK_INVOICES } from '@/lib/mockData'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const invoice = MOCK_INVOICES.find(i => i.id === id) ?? MOCK_INVOICES[1]

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link to="/dashboard/finance/invoices" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 mb-3 transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to Invoices
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">{invoice.invoice_number}</h1>
            <StatusBadge status={invoice.status} type="invoice" />
            {invoice.type === 'payable' ? (
              <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded px-2 py-0.5">Payable</span>
            ) : (
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded px-2 py-0.5">Receivable</span>
            )}
          </div>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">{invoice.counterparty_name}</p>
        </div>
        <div className="flex gap-2">
          {invoice.status === 'under_review' || invoice.status === 'pending' ? (
            <>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                Dispute
              </Button>
              <Button size="sm">Approve & Pay</Button>
            </>
          ) : invoice.status === 'approved' ? (
            <Button size="sm" className="gap-2"><DollarSign className="h-4 w-4" />Pay Now</Button>
          ) : null}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 space-y-2 text-sm">
            <div className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Invoice Details</div>
            {[
              ['Issue Date', formatDate(invoice.issue_date)],
              ['Due Date', formatDate(invoice.due_date)],
              ['Currency', invoice.currency],
              ['Load Reference', invoice.load_id ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400 dark:text-zinc-500">{k}</span>
                <span className="text-gray-700 dark:text-zinc-200">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 space-y-2 text-sm">
            <div className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Counterparty</div>
            <p className="font-medium text-gray-700 dark:text-zinc-200">{invoice.counterparty_name}</p>
            <p className="text-gray-400 dark:text-zinc-500">{invoice.counterparty_email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 space-y-2 text-sm">
            <div className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Payment Summary</div>
            {[
              ['Subtotal', formatCurrency(invoice.subtotal)],
              ['Tax', formatCurrency(invoice.tax)],
              ['Total', formatCurrency(invoice.total)],
              ['Amount Paid', formatCurrency(invoice.amount_paid)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400 dark:text-zinc-500">{k}</span>
                <span className={`font-numeric ${k === 'Total' ? 'text-gray-900 dark:text-zinc-50 font-semibold' : 'text-gray-700 dark:text-zinc-200'}`}>{v}</span>
              </div>
            ))}
            <div className="h-px bg-gray-200 dark:bg-zinc-800 my-1" />
            <div className="flex justify-between font-semibold">
              <span className="text-gray-600 dark:text-zinc-300">Balance Due</span>
              <span className="font-numeric text-red-400">{formatCurrency(invoice.balance_due)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discrepancies — THE CORE FEATURE */}
      {invoice.discrepancies && invoice.discrepancies.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Audit Results — Discrepancies Found</h3>
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5">
              {invoice.discrepancies.length} issues
            </span>
          </div>

          <div className="space-y-3">
            {invoice.discrepancies.map((disc, i) => (
              <div key={i} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-zinc-200">{disc.field}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-zinc-500">{disc.resolved ? 'Resolved' : 'Open'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-300 dark:text-zinc-600 mb-1">Contracted Rate</div>
                    <div className="font-numeric text-sm font-semibold text-green-400">
                      {typeof disc.expected === 'number' && disc.expected > 0
                        ? `$${disc.expected.toFixed(2)}/mi`
                        : 'Not Approved'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-300 dark:text-zinc-600 mb-1">Billed Amount</div>
                    <div className="font-numeric text-sm font-semibold text-red-400">
                      {typeof disc.actual === 'number' && disc.actual > 0
                        ? disc.actual > 100 ? formatCurrency(disc.actual) : `$${disc.actual.toFixed(2)}/mi`
                        : formatCurrency(disc.actual)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-300 dark:text-zinc-600 mb-1">Savings</div>
                    <div className="font-numeric text-sm font-bold text-green-400">{formatCurrency(disc.amount)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-gray-700 dark:text-zinc-200">Total savings identified on this invoice</span>
            </div>
            <span className="font-numeric text-2xl font-bold text-green-400">{formatCurrency(invoice.savings_identified)}</span>
          </div>
        </motion.div>
      )}

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800">
                {['Description', 'Qty', 'Unit Price', 'Total'].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium text-gray-400 dark:text-zinc-500 ${h === 'Qty' || h === 'Unit Price' || h === 'Total' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(invoice.line_items ?? []).map((item, i) => (
                <tr key={i} className="border-b border-gray-200/50 dark:border-zinc-800/50">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-300">{item.description}</td>
                  <td className="px-4 py-3 text-sm font-numeric text-gray-500 dark:text-zinc-400 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm font-numeric text-gray-500 dark:text-zinc-400 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="px-4 py-3 text-sm font-numeric font-medium text-gray-700 dark:text-zinc-200 text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-zinc-900/50">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-600 dark:text-zinc-300 text-right">Total</td>
                <td className="px-4 py-3 text-sm font-numeric font-bold text-gray-900 dark:text-zinc-50 text-right">{formatCurrency(invoice.total)}</td>
              </tr>
            </tbody>
          </table></div>
        </CardContent>
      </Card>

      {invoice.notes && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-4">
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Notes</p>
          <p className="text-sm text-gray-600 dark:text-zinc-300">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
