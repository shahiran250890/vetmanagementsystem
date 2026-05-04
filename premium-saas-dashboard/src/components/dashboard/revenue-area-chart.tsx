import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { revenueSeries } from '@/lib/mock-data'

function formatK(value: number): string {
  return `${value}k`
}

export function RevenueAreaChart(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-border/70 from-card to-card/30 overflow-hidden bg-gradient-to-b">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Net revenue</CardTitle>
          <CardDescription>Trailing 7 months, normalized</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.17 264)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.72 0.17 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.65 0.02 264)', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatK}
                  tick={{ fill: 'oklch(0.55 0.02 264)', fontSize: 12 }}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    background: 'oklch(0.16 0.02 264)',
                    border: '1px solid oklch(1 0 0 / 10%)',
                    borderRadius: 12,
                    color: 'oklch(0.97 0.01 264)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                  }}
                  labelStyle={{ color: 'oklch(0.75 0.02 264)', fontSize: 12 }}
                  formatter={(value) => {
                    const n = typeof value === 'number' ? value : Number(value)
                    return [`$${Number.isFinite(n) ? n : 0}k`, 'Revenue']
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.72 0.17 264)"
                  strokeWidth={2}
                  fill="url(#fillRevenue)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: 'oklch(0.85 0.12 264)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
