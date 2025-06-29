
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { GamificationStats, McqSet } from '@/lib/types';
import { achievementsList, type Achievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';
import { Lock, Star, Pencil } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { calculateLevel } from '@/lib/experience';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { preselectedAvatars, defaultAvatar } from '@/lib/avatars';

const LOCAL_STORAGE_GAMIFICATION_KEY = 'smartStudyProGamificationStats';
const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';
const LOCAL_STORAGE_AVATAR_KEY = 'smartStudyProUserAvatar';

export default function ProfilePage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([]);
  const [levelInfo, setLevelInfo] = useState({ level: 1, currentXp: 0, xpInLevel: 0, xpForNextLevel: 100, progress: 0 });
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar.url);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Load Gamification Data
      const gamificationString = localStorage.getItem(LOCAL_STORAGE_GAMIFICATION_KEY);
      const gamification: GamificationStats | null = gamificationString ? JSON.parse(gamificationString) : null;

      const mcqSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
      const mcqSets: McqSet[] | null = mcqSetsString ? JSON.parse(mcqSetsString) : [];

      const stats = { gamification, mcqSets };

      const unlocked = achievementsList.filter(ach => ach.isUnlocked(stats));
      const locked = achievementsList.filter(ach => !ach.isUnlocked(stats));
      
      const newTotalXp = unlocked.reduce((sum, ach) => sum + ach.xp, 0);

      const currentStats: GamificationStats = gamification || { currentStreak: 0, longestStreak: 0, lastSessionDate: '', sessionsCompleted: 0, perfectSessionsCount: 0, totalXp: 0 };
      
      if (currentStats.totalXp !== newTotalXp) {
        const updatedStats = { ...currentStats, totalXp: newTotalXp };
        localStorage.setItem(LOCAL_STORAGE_GAMIFICATION_KEY, JSON.stringify(updatedStats));
        window.dispatchEvent(new CustomEvent('gamificationUpdate'));
      }

      setUnlockedAchievements(unlocked);
      setLockedAchievements(locked);
      setLevelInfo(calculateLevel(newTotalXp));

      // Load Avatar
      const storedAvatar = localStorage.getItem(LOCAL_STORAGE_AVATAR_KEY);
      setAvatarUrl(storedAvatar || defaultAvatar.url);

    } catch (e) {
      console.error("Failed to load user profile data", e);
    }
    setIsLoading(false);
  }, []);

  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url);
    localStorage.setItem(LOCAL_STORAGE_AVATAR_KEY, url);
    window.dispatchEvent(new CustomEvent('avatarChange'));
    setIsAvatarDialogOpen(false);
  };

  const currentAvatarHint = preselectedAvatars.find(a => a.url === avatarUrl)?.hint || defaultAvatar.hint;

  return (
    <AppLayout pageTitle="My Profile">
      <div className="space-y-6">
        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={avatarUrl} alt="User Avatar" data-ai-hint={currentAvatarHint} />
                <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsAvatarDialogOpen(true)}
                >
                    <Pencil className="h-4 w-4"/>
                </Button>
            </div>
            <div className="flex-grow w-full">
                <div className="flex justify-between items-baseline">
                    <CardTitle className="text-3xl">Smart Student</CardTitle>
                    <span className="font-bold text-2xl text-accent">Level {levelInfo.level}</span>
                </div>
                <CardDescription>Your learning journey and achievements.</CardDescription>
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Level Progress</span>
                        <span>{levelInfo.xpInLevel} / {levelInfo.xpForNextLevel} XP</span>
                    </div>
                    <Progress value={levelInfo.progress} className="h-3" />
                </div>
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
                        <p className="font-semibold text-yellow-500 mt-1">+{ach.xp} XP</p>
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
                        <p className="italic text-muted-foreground mt-1">Locked</p>
                        <p className="font-semibold text-yellow-500 opacity-75 mt-1">+{ach.xp} XP</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Choose Your Avatar</DialogTitle>
                <DialogDescription>Select a new profile picture from the options below.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-4">
                {preselectedAvatars.map((avatar) => (
                    <button key={avatar.url} onClick={() => handleAvatarSelect(avatar.url)} className="rounded-full overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none transition-all">
                        <Avatar className="h-full w-full">
                            <AvatarImage src={avatar.url} alt={avatar.hint} data-ai-hint={avatar.hint} />
                            <AvatarFallback>SS</AvatarFallback>
                        </Avatar>
                    </button>
                ))}
            </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
