'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/components/ui/chart';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { TypeBreakdown } from '../types';

interface TypePieChartProps {
  title: string;
  description?: string;
  data: TypeBreakdown[];
  isLoading?: boolean;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const TYPE_LABELS: Record<string, string> = {
  place: 'สถานที่',
  video: 'วิดีโอ',
  website: 'เว็บไซต์',
  image: 'รูปภาพ',
};

export function TypePieChart({
  title,
  description,
  data,
  isLoading,
}: TypePieChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Create chart config from data
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.type] = {
      label: TYPE_LABELS[item.type] || item.type,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  const formattedData = data.map((item, index) => ({
    ...item,
    label: TYPE_LABELS[item.type] || item.type,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ไม่มีข้อมูล</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>
                        {TYPE_LABELS[name as string] || name}: {value} ({((value as number) / data.reduce((sum, d) => sum + d.count, 0) * 100).toFixed(1)}%)
                      </span>
                    )}
                  />
                }
              />
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="type"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => TYPE_LABELS[value] || value}
                iconType="circle"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
