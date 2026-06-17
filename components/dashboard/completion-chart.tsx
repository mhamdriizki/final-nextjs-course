'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  data: { date: string; completed: number }[]
}

export function CompletionChart({ data }: Props) {
  // Show only every 5th label to avoid crowding
  const tickFormatter = (val: string, i: number) => (i % 5 === 0 ? val.slice(5) : '')

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(v) => `Date: ${v}`}
        />
        <Line
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="#5d7066"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
