
"use client";

import { Pie, PieChart, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

interface MasteryDistributionChartProps {
  data: {
    level: string;
    count: number;
    color: string;
  }[];
}

export function MasteryDistributionChart({ data }: MasteryDistributionChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.level,
      value: item.count,
      fill: item.color,
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.level] = {
        label: item.level,
        color: item.color,
      };
      return acc;
    }, {} as ChartConfig);
  }, [data]);

  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pie-chart text-muted-foreground mb-4">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
      <p className="text-muted-foreground">No question data available.</p>
      <p className="text-sm text-muted-foreground">Study some questions to see your mastery distribution!</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-accent" />
            Overall Mastery Distribution
        </CardTitle>
        <CardDescription>
          A look at all your questions across different mastery levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {chartData.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full max-w-[400px]">
            <PieChart>
              <RechartsTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-mt-4"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
