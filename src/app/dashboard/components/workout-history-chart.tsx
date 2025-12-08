'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, subMonths } from 'date-fns';
import { useMemo } from 'react';

const generateDefaultChartData = () => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(today, i);
        data.push({ month: format(date, 'MMM'), workouts: 0 });
    }
    return data;
};

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
  const defaultChartData = useMemo(() => generateDefaultChartData(), []);
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
          allowDecimals={false}
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
