import { motion } from 'framer-motion'

import { DataTable } from '@/components/data-table/data-table'
import { invoiceColumns } from '@/components/data-table/invoices-columns'
import { Badge } from '@/components/ui/badge'
import { invoiceSeed } from '@/lib/mock-data'

export function LedgerPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-full px-3 font-semibold tracking-wide uppercase">
            Finance
          </Badge>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Revenue integrity</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ledger</h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
          Sortable columns, faceted status filters, global search, and pagination—wired for real datasets without
          sacrificing polish.
        </p>
      </motion.div>

      <DataTable columns={invoiceColumns} data={invoiceSeed} />
    </div>
  )
}
