
"use client";

import { useEffect, useState } from 'react';
import type { GamificationStats } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateLevel } from '@/lib/experience';
import { Progress } from '@/components/ui/progress';

const LOCAL_STORAGE_GAMIFICATION_KEY = 'smartStudyProGamificationStats';

interface LevelInfo {
    level: number;
    currentXp: number;
    xpInLevel: number;
    xpForNextLevel: number;
    progress: number;
}

export function LevelDisplay() {
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedStatsString = localStorage.getItem(LOCAL_STORAGE_GAMIFICATION_KEY);
      if (storedStatsString) {
        try {
          const stats: GamificationStats = JSON.parse(storedStatsString);
          setLevelInfo(calculateLevel(stats.totalXp ?? 0));
        } catch (e) {
          setLevelInfo(calculateLevel(0));
        }
      } else {
        setLevelInfo(calculateLevel(0));
      }
    };

    handleStorageChange();
    window.addEventListener('gamificationUpdate', handleStorageChange);
    return () => {
      window.removeEventListener('gamificationUpdate', handleStorageChange);
    };
  }, []);

  if (!levelInfo || (levelInfo.level === 1 && levelInfo.currentXp === 0)) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors",
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
            )}
          >
            <Star className="h-5 w-5" />
            <span>Lv. {levelInfo.level}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-48">
          <p className="font-semibold">Level {levelInfo.level}</p>
          <p className="text-xs text-muted-foreground">{levelInfo.xpInLevel} / {levelInfo.xpForNextLevel} XP</p>
          <Progress value={levelInfo.progress} className="h-2 mt-1" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
