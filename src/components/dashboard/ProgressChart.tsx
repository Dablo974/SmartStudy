
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';

interface ProgressChartProps {
  setMastery?: { [setName: string]: number };
}

const chartConfig = {
  mastery: {
    label: "Mastery %",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const MAX_SETS_TO_DISPLAY_CHART = 5;

export function ProgressChart({ setMastery = {} }: ProgressChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(setMastery)
      .map(([setName, masteryValue]) => ({
        setName: setName, // Use the file/set name for the axis
        mastery: parseFloat(masteryValue.toFixed(1)),
      }))
      .sort((a, b) => a.mastery - b.mastery) // Sort by lowest mastery first
      .slice(0, MAX_SETS_TO_DISPLAY_CHART);
  }, [setMastery]);

  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3 text-muted-foreground mb-4">
        <path d="M3 3v18h18"/>
        <path d="M7 16V8"/>
        <path d="M12 16V4"/>
        <path d="M17 16v-3"/>
      </svg>
      <p className="text-muted-foreground">No set mastery data available yet.</p>
      <p className="text-sm text-muted-foreground">Upload question sets and study to see your progress!</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lowest Set Mastery</CardTitle>
        <CardDescription>
          Your mastery level for the {chartData.length > 1 ? `bottom ${chartData.length}` : `${chartData.length}`} question set(s). Focus on these areas!
          {Object.keys(setMastery).length > MAX_SETS_TO_DISPLAY_CHART && ` Showing ${MAX_SETS_TO_DISPLAY_CHART} of ${Object.keys(setMastery).length} tracked sets.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart 
              data={chartData} 
              margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
              layout="vertical" 
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis 
                dataKey="setName" 
                type="category" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                width={100} 
                interval={0} 
                tickFormatter={(value) => value.length > 15 ? `${value.substring(0,13)}...` : value}
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
