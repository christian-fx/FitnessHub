'use client';

import { PolarGrid, PolarAngleAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const defaultChartData = [
  { metric: 'Strength', value: 0 },
  { metric: 'Cardio', value: 0 },
  { metric: 'Flexibility', value: 0 },
  { metric: 'Endurance', value: 0 },
  { metric: 'Balance', value: 0 },
];

const chartConfig = {
  value: {
    label: 'Progress',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

type ProgressOverviewChartProps = {
    data?: { metric: string; value: number }[];
};

export function ProgressOverviewChart({ data }: ProgressOverviewChartProps) {
  const chartData = data && data.length > 0 ? data : defaultChartData;
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadarChart data={chartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <PolarAngleAxis dataKey="metric" />
        <PolarGrid />
        <Radar
          dataKey="value"
          fill="var(--color-value)"
          fillOpacity={0.6}
          stroke="var(--color-value)"
        />
      </RadarChart>
    </ChartContainer>
  );
}
