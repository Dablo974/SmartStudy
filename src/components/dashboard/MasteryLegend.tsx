"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { masteryLevels } from '@/lib/mastery';
import { cn } from '@/lib/utils';
import { BookHeart, Info } from 'lucide-react';

const masteryDescriptions = [
    "This question is new or was answered incorrectly. It will appear in your next study session.",
    "You're starting to learn this one. It will reappear in 2 sessions to strengthen your memory.",
    "You're becoming familiar with this concept. It will reappear in 4 sessions.",
    "You have a good understanding of the topic. It will reappear in 6 sessions to ensure long-term retention.",
    "You've mastered this question! It will reappear in 8 sessions to keep it fresh in your mind."
];

export function MasteryLegend() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-6 w-6 text-accent" />
                    Mastery Level Guide
                </CardTitle>
                <CardDescription>
                    Your mastery level for each question is based on the principle of spaced repetition.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {masteryLevels.map((mastery, index) => (
                        <li key={mastery.level} className="flex flex-col sm:flex-row items-start gap-3">
                            <span className={cn(
                                "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap",
                                mastery.className
                            )}>
                                <BookHeart className="h-3.5 w-3.5" />
                                {mastery.level}
                            </span>
                            <p className="text-sm text-muted-foreground mt-0.5 sm:mt-0">
                                {masteryDescriptions[index]}
                            </p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
