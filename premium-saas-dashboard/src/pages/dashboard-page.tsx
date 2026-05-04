import { Activity, CreditCard, Radar, Users } from 'lucide-react'
import { motion } from 'framer-motion'

import { ActivityBarChart } from '@/components/dashboard/activity-bar-chart'
import { MetricCard } from '@/components/dashboard/metric-card'
import { RevenueAreaChart } from '@/components/dashboard/revenue-area-chart'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const metrics = [
  {
    label: 'Net revenue',
    value: '$284.6k',
    hint: 'vs. prior month',
    delta: 12.4,
    icon: CreditCard,
  },
  {
    label: 'Active accounts',
    value: '1,842',
    hint: 'rolling 28d',
    delta: 3.1,
    icon: Users,
  },
  {
    label: 'API reliability',
    value: '99.992%',
    hint: 'p99 latency budget',
    delta: 0.4,
    icon: Radar,
  },
  {
    label: 'Automation runs',
    value: '482k',
    hint: 'scheduled + webhook',
    delta: -1.8,
    icon: Activity,
  },
]

export function DashboardPage(): React.JSX.Element {
  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 font-semibold tracking-wide uppercase">
              Live
            </Badge>
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">North America</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Command center</h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
            A calm, high-signal snapshot of revenue, reliability, and workload—tuned for operators who care about
            craft and clarity.
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
          <span className="bg-primary/15 text-primary rounded-full px-3 py-1">Updated 2m ago</span>
          <Separator orientation="vertical" className="h-4" />
          <span>UTC</span>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, index) => (
          <MetricCard key={m.label} index={index} {...m} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueAreaChart />
        </div>
        <div className="lg:col-span-2">
          <ActivityBarChart />
        </div>
      </div>
    </div>
  )
}
