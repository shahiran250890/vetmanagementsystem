import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { InvoiceStatus } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const statusOptions: InvoiceStatus[] = ['paid', 'pending', 'failed', 'draft']

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>): React.JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'issuedAt', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  /* eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table */
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? '').toLowerCase()
      if (!q) {
        return true
      }
      const values = Object.values(row.original as Record<string, unknown>)
      return values.some((v) => String(v).toLowerCase().includes(q))
    },
    initialState: {
      pagination: { pageSize: 5 },
    },
  })

  const statusColumn = table.getColumn('status')
  const statusFilter = (statusColumn?.getFilterValue() as string[] | undefined) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="border-border/70 bg-card/40 space-y-4 rounded-xl border p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Filter any column…"
            className="h-10 rounded-xl pl-10"
            aria-label="Table search"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground size-4" aria-hidden />
            <Select
              value={statusFilter.length === 1 ? statusFilter[0]! : 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  statusColumn?.setFilterValue(undefined)
                  return
                }
                statusColumn?.setFilterValue([value])
              }}
            >
              <SelectTrigger className="h-10 w-[11.5rem] rounded-xl">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-xl"
            onClick={() => {
              setGlobalFilter('')
              statusColumn?.setFilterValue(undefined)
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[11px] font-semibold tracking-wide uppercase">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-28 text-center text-sm">
                  No results match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Page{' '}
          <span className="text-foreground font-medium">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <span className="mx-2 text-border">·</span>
          <span className="tabular-nums">{table.getFilteredRowModel().rows.length}</span> rows
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  'size-2.5 rounded-full transition-colors',
                  i === table.getState().pagination.pageIndex ? 'bg-primary' : 'bg-muted-foreground/25 hover:bg-muted-foreground/40',
                )}
                aria-label={`Go to page ${i + 1}`}
                onClick={() => table.setPageIndex(i)}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
