import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { InvoiceRow, InvoiceStatus } from '@/lib/mock-data'

function statusVariant(status: InvoiceStatus): 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' {
  switch (status) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function formatMoney(cents: number, currency: string): string {
  if (cents === 0) {
    return '—'
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100)
}

export const invoiceColumns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
    cell: ({ row }) => <span className="font-mono text-xs tracking-tight">{row.original.id}</span>,
  },
  {
    accessorKey: 'customer',
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 h-8 px-2 text-xs font-semibold tracking-wide uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Customer
        <ArrowUpDown className="ml-1 size-3.5 opacity-60" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{row.original.customer}</span>
        <span className="text-muted-foreground text-xs">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.plan}</span>,
  },
  {
    accessorKey: 'amountCents',
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 h-8 px-2 text-xs font-semibold tracking-wide uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Amount
        <ArrowUpDown className="ml-1 size-3.5 opacity-60" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatMoney(row.original.amountCents, row.original.currency)}
      </span>
    ),
    sortingFn: (a, b) => a.original.amountCents - b.original.amountCents,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) {
        return true
      }
      return filterValue.includes(row.getValue(columnId) as string)
    },
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={statusVariant(status)} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'issuedAt',
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 h-8 px-2 text-xs font-semibold tracking-wide uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Issued
        <ArrowUpDown className="ml-1 size-3.5 opacity-60" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-muted-foreground text-sm tabular-nums">{row.original.issuedAt}</span>,
  },
]
