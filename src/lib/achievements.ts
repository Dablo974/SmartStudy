
'use client';

import type { GamificationStats, McqSet } from './types';
import { Flame, Star, BrainCircuit, Sparkles, FilePlus2, Award, Library, Target, TrendingUp, Trophy, Medal } from 'lucide-react';
import { masteryLevels } from './mastery';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  xp: number;
  isUnlocked: (stats: { gamification: GamificationStats | null; mcqSets: McqSet[] | null }) => boolean;
}

const MAX_INTERVAL_INDEX = masteryLevels.length - 1;

export const achievementsList: Achievement[] = [
  {
    id: 'first-session',
    name: 'First Step',
    description: 'Complete your first study session.',
    icon: Star,
    xp: 10,
    isUnlocked: (stats) => !!stats.gamification?.lastSessionDate,
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Upload or create your first question set.',
    icon: FilePlus2,
    xp: 20,
    isUnlocked: (stats) => (stats.mcqSets?.length ?? 0) > 0,
  },
    {
    id: 'ai-explorer',
    name: 'AI Explorer',
    description: 'Generate a question set using AI.',
    icon: Sparkles,
    xp: 25,
    isUnlocked: (stats) =>
      !!stats.mcqSets?.some(set => set.fileName.startsWith('AI-Generated -')),
  },
  {
    id: '7-day-streak',
    name: 'Consistent Learner',
    description: 'Maintain a 7-day study streak.',
    icon: Flame,
    xp: 50,
    isUnlocked: (stats) => (stats.gamification?.currentStreak ?? 0) >= 7,
  },
  {
    id: 'master-1',
    name: 'Master of One',
    description: 'Master your first question.',
    icon: BrainCircuit,
    xp: 30,
    isUnlocked: (stats) =>
      !!stats.mcqSets?.some(set =>
        set.isActive && set.mcqs.some(mcq => mcq.intervalIndex === MAX_INTERVAL_INDEX)
      ),
  },
  {
    id: 'high-achiever',
    name: 'High Achiever',
    description: 'Answer 100 questions correctly in total.',
    icon: Target,
    xp: 50,
    isUnlocked: (stats) => {
        const totalCorrect = stats.mcqSets?.reduce((acc, set) => {
            if (!set.isActive) return acc;
            return acc + set.mcqs.reduce((mcqAcc, mcq) => mcqAcc + (mcq.timesCorrect || 0), 0);
        }, 0) ?? 0;
        return totalCorrect >= 100;
    }
  },
  {
    id: 'knowledge-hoarder',
    name: 'Knowledge Hoarder',
    description: 'Accumulate over 200 questions across all active sets.',
    icon: Library,
    xp: 75,
    isUnlocked: (stats) => {
        const totalQuestions = stats.mcqSets?.reduce((acc, set) => {
            if (!set.isActive) return acc;
            return acc + set.mcqs.length;
        }, 0) ?? 0;
        return totalQuestions >= 200;
    }
  },
  {
    id: 'set-master',
    name: 'Set Master',
    description: 'Master an entire question set.',
    icon: Award,
    xp: 150,
    isUnlocked: (stats) =>
      !!stats.mcqSets?.some(set =>
        set.isActive &&
        set.mcqs.length > 0 &&
        set.mcqs.every(mcq => mcq.intervalIndex === MAX_INTERVAL_INDEX)
      ),
  },
  {
    id: 'marathon-runner',
    name: 'Marathon Runner',
    description: 'Maintain a 30-day study streak.',
    icon: TrendingUp,
    xp: 150,
    isUnlocked: (stats) => (stats.gamification?.currentStreak ?? 0) >= 30,
  },
  {
    id: 'perfect-session',
    name: 'Perfecto!',
    description: 'Get a 100% correct score in a study session.',
    icon: Trophy,
    xp: 40,
    isUnlocked: (stats) => (stats.gamification?.perfectSessionsCount ?? 0) > 0,
  },
  {
    id: 'session-veteran',
    name: 'Session Veteran',
    description: 'Complete 10 study sessions.',
    icon: Medal,
    xp: 50,
    isUnlocked: (stats) => (stats.gamification?.sessionsCompleted ?? 0) >= 10,
  },
];
