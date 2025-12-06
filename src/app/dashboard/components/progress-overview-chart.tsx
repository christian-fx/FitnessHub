'use client';

import { PolarGrid, PolarAngleAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { metric: 'Strength', value: 80 },
  { metric: 'Cardio', value: 90 },
  { metric: 'Flexibility', value: 65 },
  { metric: 'Endurance', value: 75 },
  { metric: 'Balance', value: 85 },
];

const chartConfig = {
  value: {
    label: 'Progress',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function ProgressOverviewChart() {
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
