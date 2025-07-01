
'use client';

import { useToast } from '@/hooks/use-toast';
import { achievementsList } from '@/lib/achievements';
import type { GamificationStats, McqSet } from '@/lib/types';
import { Trophy } from 'lucide-react';

const NOTIFIED_ACHIEVEMENTS_KEY = 'smartStudyProNotifiedAchievementIds';

export function checkAndNotifyAchievements(
  toast: ReturnType<typeof useToast>['toast'],
  gamification: GamificationStats | null,
  mcqSets: McqSet[] | null
) {
  if (!mcqSets) return;

  const previouslyNotifiedIdsStr = localStorage.getItem(NOTIFIED_ACHIEVEMENTS_KEY);
  const previouslyNotifiedIds: string[] = previouslyNotifiedIdsStr
    ? JSON.parse(previouslyNotifiedIdsStr)
    : [];

  const allCurrentlyUnlocked = achievementsList.filter((ach) =>
    ach.isUnlocked({ gamification, mcqSets })
  );

  const newlyUnlocked = allCurrentlyUnlocked.filter(
    (ach) => !previouslyNotifiedIds.includes(ach.id)
  );

  if (newlyUnlocked.length > 0) {
    newlyUnlocked.forEach((ach, index) => {
      // Stagger notifications slightly to prevent them from overlapping
      setTimeout(() => {
        toast({
          title: (
            <div className="flex items-center gap-2 font-semibold">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span>Achievement Unlocked!</span>
            </div>
          ),
          description: `${ach.name} (+${ach.xp} XP)`,
        });
      }, index * 800);
    });

    const allUnlockedIds = allCurrentlyUnlocked.map((ach) => ach.id);
    localStorage.setItem(
      NOTIFIED_ACHIEVEMENTS_KEY,
      JSON.stringify(allUnlockedIds)
    );
    // Dispatch an event to notify other components (like level display) of the XP change
    window.dispatchEvent(new CustomEvent('gamificationUpdate'));
  }
}
