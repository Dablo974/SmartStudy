
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';

interface ProgressChartProps {
  topicMastery?: { [topic: string]: number };
}

const chartConfig = {
  mastery: {
    label: "Mastery %",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProgressChart({ topicMastery = {} }: ProgressChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(topicMastery)
      .map(([topic, masteryValue]) => ({
        topic: topic,
        mastery: parseFloat(masteryValue.toFixed(1)), // Ensure mastery is a number
      }))
      .sort((a, b) => b.mastery - a.mastery); // Sort by mastery descending
  }, [topicMastery]);

  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3 text-muted-foreground mb-4">
        <path d="M3 3v18h18"/>
        <path d="M7 16V8"/>
        <path d="M12 16V4"/>
        <path d="M17 16v-3"/>
      </svg>
      <p className="text-muted-foreground">No topic mastery data available yet.</p>
      <p className="text-sm text-muted-foreground">Start studying or upload questions to see your progress!</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Mastery Overview</CardTitle>
        <CardDescription>Your current mastery level across different topics.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart 
              data={chartData} 
              margin={{ top: 5, right: 20, left: -5, bottom: 5 }}
              layout="vertical" // Change to vertical layout for better topic label readability
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis 
                dataKey="topic" 
                type="category" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                width={80} // Adjust width for topic labels
                interval={0} // Show all topic labels
              />
              <RechartsTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="mastery" fill="var(--color-mastery)" radius={4} barSize={20} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
