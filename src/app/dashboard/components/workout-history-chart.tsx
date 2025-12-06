'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const defaultChartData = [
  { month: 'Jan', workouts: 0 },
  { month: 'Feb', workouts: 0 },
  { month: 'Mar', workouts: 0 },
  { month: 'Apr', workouts: 0 },
  { month: 'May', workouts: 0 },
  { month: 'Jun', workouts: 0 },
];

const chartConfig = {
  workouts: {
    label: 'Workouts',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

type WorkoutHistoryChartProps = {
    data?: { month: string; workouts: number }[];
}

export function WorkoutHistoryChart({ data }: WorkoutHistoryChartProps) {
  const chartData = data && data.length > 0 ? data : defaultChartData;
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
