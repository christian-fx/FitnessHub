'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'Jan', workouts: 18 },
  { month: 'Feb', workouts: 22 },
  { month: 'Mar', workouts: 25 },
  { month: 'Apr', workouts: 20 },
  { month: 'May', workouts: 28 },
  { month: 'Jun', workouts: 26 },
];

const chartConfig = {
  workouts: {
    label: 'Workouts',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function WorkoutHistoryChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={4}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="workouts" fill="var(--color-workouts)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
