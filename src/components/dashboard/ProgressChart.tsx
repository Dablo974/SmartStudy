"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const chartData = [
  { day: "Mon", studied: 5, goal: 10 },
  { day: "Tue", studied: 8, goal: 10 },
  { day: "Wed", studied: 12, goal: 10 },
  { day: "Thu", studied: 7, goal: 10 },
  { day: "Fri", studied: 10, goal: 10 },
  { day: "Sat", studied: 15, goal: 15 },
  { day: "Sun", studied: 3, goal: 10 },
];

const chartConfig = {
  studied: {
    label: "Questions Studied",
    color: "hsl(var(--chart-1))",
  },
  goal: {
    label: "Daily Goal",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Study Progress</CardTitle>
        <CardDescription>Number of questions studied vs. daily goal.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <RechartsTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="studied" fill="var(--color-studied)" radius={4} />
            <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
