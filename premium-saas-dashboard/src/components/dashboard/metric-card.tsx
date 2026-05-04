import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type MetricCardProps = {
  label: string
  value: string
  hint: string
  delta: number
  icon: LucideIcon
  index: number
}

export function MetricCard({ label, value, hint, delta, icon: Icon, index }: MetricCardProps): React.JSX.Element {
  const positive = delta >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="from-card to-card/40 border-border/70 relative overflow-hidden bg-gradient-to-b shadow-black/10">
        <div className="from-primary/18 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r via-primary/40 to-transparent" />
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          </div>
          <div className="bg-primary/12 ring-primary/15 text-primary flex size-10 items-center justify-center rounded-xl ring-1">
            <Icon className="size-4" aria-hidden />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">{hint}</p>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
                positive
                  ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20',
              )}
            >
              {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {positive ? '+' : ''}
              {delta}%
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
