
'use client';

import type { GamificationStats, McqSet } from './types';
import { Flame, Star, BrainCircuit, Sparkles, FilePlus2 } from 'lucide-react';
import { masteryLevels } from './mastery';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: (stats: { gamification: GamificationStats | null; mcqSets: McqSet[] | null }) => boolean;
}

const MAX_INTERVAL_INDEX = masteryLevels.length - 1;

export const achievementsList: Achievement[] = [
  {
    id: 'first-session',
    name: 'First Step',
    description: 'Complete your first study session.',
    icon: Star,
    isUnlocked: (stats) => !!stats.gamification?.lastSessionDate,
  },
  {
    id: '7-day-streak',
    name: 'Consistent Learner',
    description: 'Maintain a 7-day study streak.',
    icon: Flame,
    isUnlocked: (stats) => (stats.gamification?.currentStreak ?? 0) >= 7,
  },
  {
    id: 'master-1',
    name: 'Master of One',
    description: 'Master your first question.',
    icon: BrainCircuit,
    isUnlocked: (stats) =>
      !!stats.mcqSets?.some(set =>
        set.isActive && set.mcqs.some(mcq => mcq.intervalIndex === MAX_INTERVAL_INDEX)
      ),
  },
  {
    id: 'ai-explorer',
    name: 'AI Explorer',
    description: 'Generate a question set using AI.',
    icon: Sparkles,
    isUnlocked: (stats) =>
      !!stats.mcqs?.some(set => set.fileName.startsWith('AI-Generated -')),
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Upload or create your first question set.',
    icon: FilePlus2,
    isUnlocked: (stats) => (stats.mcqSets?.length ?? 0) > 0,
  },
];
