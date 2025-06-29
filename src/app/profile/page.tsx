
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { GamificationStats, McqSet } from '@/lib/types';
import { achievementsList, type Achievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const LOCAL_STORAGE_GAMIFICATION_KEY = 'smartStudyProGamificationStats';
const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';

export default function ProfilePage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const gamificationString = localStorage.getItem(LOCAL_STORAGE_GAMIFICATION_KEY);
      const gamification: GamificationStats | null = gamificationString ? JSON.parse(gamificationString) : null;

      const mcqSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
      const mcqSets: McqSet[] | null = mcqSetsString ? JSON.parse(mcqSetsString) : [];

      const stats = { gamification, mcqSets };

      const unlocked = achievementsList.filter(ach => ach.isUnlocked(stats));
      const locked = achievementsList.filter(ach => !ach.isUnlocked(stats));
      
      setUnlockedAchievements(unlocked);
      setLockedAchievements(locked);

    } catch (e) {
      console.error("Failed to load user profile data", e);
    }
    setIsLoading(false);
  }, []);

  return (
    <AppLayout pageTitle="My Profile">
      <div className="space-y-6">
        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">Smart Student</CardTitle>
              <CardDescription>Your learning journey and achievements.</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-100">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              You've unlocked {unlockedAchievements.length} of {achievementsList.length} achievements. Keep it up!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading achievements...</p>
            ) : (
              <TooltipProvider>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {unlockedAchievements.map((ach) => (
                    <Tooltip key={ach.id}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-accent/10 border-accent/30 transform transition-transform hover:scale-105">
                          <ach.icon className="h-10 w-10 text-accent" />
                          <p className="mt-2 text-sm font-semibold">{ach.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-bold">{ach.name}</p>
                        <p>{ach.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                   {lockedAchievements.map((ach) => (
                    <Tooltip key={ach.id}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-muted/50 text-muted-foreground opacity-60">
                          <Lock className="h-10 w-10" />
                          <p className="mt-2 text-sm font-semibold">{ach.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-bold">{ach.name}</p>
                        <p>{ach.description}</p>
                        <p className="italic text-muted-foreground">Locked</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
