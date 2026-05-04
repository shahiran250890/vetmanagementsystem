import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { activitySeries } from '@/lib/mock-data'

export function ActivityBarChart(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-border/70 from-card to-card/30 h-full bg-gradient-to-b">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Traffic mix</CardTitle>
          <CardDescription>Last 30 days by surface</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activitySeries} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.65 0.02 264)', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.55 0.02 264)', fontSize: 12 }}
                  width={32}
                />
                <Tooltip
                  cursor={{ fill: 'oklch(1 0 0 / 4%)' }}
                  contentStyle={{
                    background: 'oklch(0.16 0.02 264)',
                    border: '1px solid oklch(1 0 0 / 10%)',
                    borderRadius: 12,
                    color: 'oklch(0.97 0.01 264)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                  }}
                  formatter={(value) => {
                    const n = typeof value === 'number' ? value : Number(value)
                    return [`${Number.isFinite(n) ? n : 0}%`, 'Share']
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[10, 10, 6, 6]}
                  fill="oklch(0.62 0.14 264)"
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
