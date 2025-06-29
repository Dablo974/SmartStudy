
"use client";

import type { MCQ } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { masteryLevels } from '@/lib/mastery';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SessionSummaryProps {
  initialQuestions: MCQ[];
  finalQuestions: MCQ[];
}

export function SessionSummary({ initialQuestions, finalQuestions }: SessionSummaryProps) {
  if (initialQuestions.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-100">
      <CardHeader>
        <CardTitle>Session Summary</CardTitle>
        <CardDescription>Here is your mastery progress for this session.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] pr-4">
            <ul className="space-y-3">
            {initialQuestions.map((initialQ, index) => {
                const finalQ = finalQuestions[index];
                if (!finalQ || initialQ.id !== finalQ.id) return null; // Safety check

                const initialMastery = masteryLevels[initialQ.intervalIndex] ?? masteryLevels[0];
                const finalMastery = masteryLevels[finalQ.intervalIndex] ?? masteryLevels[0];

                return (
                <li key={initialQ.id} className="text-sm p-3 rounded-md bg-muted/50 text-left">
                    <p className="font-medium mb-2">{index + 1}. {initialQ.question}</p>
                    <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", initialMastery.className)}>
                        {initialMastery.level}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", finalMastery.className)}>
                        {finalMastery.level}
                    </span>
                    </div>
                </li>
                );
            })}
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
