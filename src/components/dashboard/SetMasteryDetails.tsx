
"use client";
import type { McqSet } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { masteryLevels } from '@/lib/mastery';
import { cn } from '@/lib/utils';
import { BookHeart } from 'lucide-react';

interface SetMasteryDetailsProps {
    sets: McqSet[];
    sortedMastery: [string, number][];
}

const MAX_SETS_TO_DISPLAY_LIST = 5;

export function SetMasteryDetails({ sets, sortedMastery }: SetMasteryDetailsProps) {
    const sortedSets = sortedMastery
      .map(([fileName]) => sets.find(s => s.fileName === fileName))
      .filter(Boolean) as McqSet[];
    
    if (sortedSets.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-4">No set mastery data to display yet. Study some questions to see your progress here.</p>;
    }

    return (
        <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
                {sortedSets.slice(0, MAX_SETS_TO_DISPLAY_LIST).map((set) => {
                     const masteryValue = sortedMastery.find(([fileName]) => fileName === set.fileName)?.[1] ?? 0;
                    return (
                        <AccordionItem value={set.id} key={set.id}>
                            <AccordionTrigger className="hover:no-underline text-left">
                                <div className="flex justify-between items-center w-full pr-4">
                                    <span className="font-medium text-foreground truncate max-w-[70%]">{set.fileName}</span>
                                    <span className={cn(
                                        "text-sm font-semibold",
                                        masteryValue < 33 ? "text-destructive" : masteryValue < 66 ? "text-orange-500" : "text-green-500"
                                    )}>
                                        {masteryValue.toFixed(1)}% Mastery
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 pl-2">
                                    {set.mcqs.map((mcq, index) => {
                                        const mastery = masteryLevels[mcq.intervalIndex] ?? masteryLevels[0];
                                        return (
                                            <li key={mcq.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                                                <span className="truncate pr-4 flex-1">{index + 1}. {mcq.question}</span>
                                                <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap", mastery.className)}>
                                                    <BookHeart className="h-3.5 w-3.5" />
                                                    {mastery.level}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            {sortedSets.length > MAX_SETS_TO_DISPLAY_LIST && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                    Showing {MAX_SETS_TO_DISPLAY_LIST} of {sortedSets.length} sets with the lowest mastery.
                </p>
            )}
        </div>
    );
}
