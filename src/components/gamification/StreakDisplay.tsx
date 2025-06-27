
"use client";

import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { GamificationStats } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const LOCAL_STORAGE_GAMIFICATION_KEY = 'smartStudyProGamificationStats';

export function StreakDisplay() {
  const [stats, setStats] = useState<GamificationStats | null>(null);

  useEffect(() => {
    // Handler to update state when storage changes
    const handleStorageChange = () => {
      const storedStatsString = localStorage.getItem(LOCAL_STORAGE_GAMIFICATION_KEY);
      if (storedStatsString) {
        try {
          setStats(JSON.parse(storedStatsString));
        } catch (e) {
          setStats(null);
        }
      } else {
        setStats(null);
      }
    };
    
    // Initial load
    handleStorageChange();

    // Listen for custom event to force re-render
    window.addEventListener('gamificationUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('gamificationUpdate', handleStorageChange);
    };
  }, []);

  const currentStreak = stats?.currentStreak ?? 0;
  const longestStreak = stats?.longestStreak ?? 0;

  if (currentStreak === 0) {
    return null; // Don't show anything if streak is 0
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors",
              "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
            )}
          >
            <Flame className="h-5 w-5" />
            <span>{currentStreak}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Current streak: {currentStreak} day(s)</p>
          <p>Longest streak: {longestStreak} day(s)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
