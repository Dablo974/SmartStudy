
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { dailyQuestsList, type Quest } from '@/lib/quests';
import type { DailyQuestStats, GamificationStats, QuestEvent } from '@/lib/types';
import { Trophy, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LOCAL_STORAGE_QUEST_STATS_KEY = 'smartStudyProDailyQuestStats';
const LOCAL_STORAGE_GAMIFICATION_KEY = 'smartStudyProGamificationStats';

export function DailyQuests() {
  const { toast } = useToast();
  const [questStats, setQuestStats] = useState<DailyQuestStats | null>(null);
  const [events, setEvents] = useState<QuestEvent[]>([]);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Load events for today
    const eventKey = `smartStudyProQuestEvents_${todayStr}`;
    const storedEvents = localStorage.getItem(eventKey);
    setEvents(storedEvents ? JSON.parse(storedEvents) : []);
    
    // Load/reset claimed quests stats
    const storedStatsStr = localStorage.getItem(LOCAL_STORAGE_QUEST_STATS_KEY);
    let currentQuestStats: DailyQuestStats;
    if (storedStatsStr) {
      currentQuestStats = JSON.parse(storedStatsStr);
      if (currentQuestStats.date !== todayStr) {
        currentQuestStats = { date: todayStr, claimedQuestIds: [] };
        localStorage.setItem(LOCAL_STORAGE_QUEST_STATS_KEY, JSON.stringify(currentQuestStats));
      }
    } else {
      currentQuestStats = { date: todayStr, claimedQuestIds: [] };
      localStorage.setItem(LOCAL_STORAGE_QUEST_STATS_KEY, JSON.stringify(currentQuestStats));
    }
    setQuestStats(currentQuestStats);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('questUpdate', loadData);
    return () => {
      window.removeEventListener('questUpdate', loadData);
    };
  }, []);

  const handleClaimReward = (quest: Quest) => {
    if (!questStats) return;

    // Update gamification stats
    const gamificationString = localStorage.getItem(LOCAL_STORAGE_GAMIFICATION_KEY);
    const gamification: GamificationStats = gamificationString 
      ? JSON.parse(gamificationString)
      : { currentStreak: 0, longestStreak: 0, lastSessionDate: '', sessionsCompleted: 0, perfectSessionsCount: 0, totalXp: 0 };
    
    gamification.totalXp += quest.xp;
    localStorage.setItem(LOCAL_STORAGE_GAMIFICATION_KEY, JSON.stringify(gamification));

    // Update quest stats
    const updatedQuestStats = {
      ...questStats,
      claimedQuestIds: [...questStats.claimedQuestIds, quest.id],
    };
    localStorage.setItem(LOCAL_STORAGE_QUEST_STATS_KEY, JSON.stringify(updatedQuestStats));
    setQuestStats(updatedQuestStats);

    // Notify user
    toast({
      title: "Quest Reward Claimed!",
      description: `You earned ${quest.xp} XP for completing "${quest.name}".`,
    });
    
    // Trigger global updates
    window.dispatchEvent(new CustomEvent('gamificationUpdate'));
  };

  if (!questStats) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-accent" />Daily Quests</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Loading quests...</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" />
            Daily Quests
        </CardTitle>
        <CardDescription>Complete daily tasks to earn XP and level up!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
            {dailyQuestsList.map((quest) => {
            const { current, goal } = quest.getProgress(events);
            const progress = Math.min((current / goal) * 100, 100);
            const isCompleted = current >= goal;
            const isClaimed = questStats.claimedQuestIds.includes(quest.id);

            return (
                <div key={quest.id} className="flex items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-1 items-center gap-4 cursor-help">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <quest.icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-medium">{quest.name}</p>
                                        <p className="text-xs text-muted-foreground">+{quest.xp} XP</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Progress value={progress} className="h-2 flex-1" />
                                        <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                                            {Math.min(current, goal)}/{goal}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{quest.description}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Button
                        size="sm"
                        variant={isClaimed ? "outline" : "default"}
                        disabled={!isCompleted || isClaimed}
                        onClick={() => handleClaimReward(quest)}
                        className="w-28"
                    >
                        {isClaimed ? <><Check className="mr-2 h-4 w-4" /> Claimed</> : 'Claim'}
                    </Button>
                </div>
            );
            })}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
