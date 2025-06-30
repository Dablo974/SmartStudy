
'use client';

import type { QuestEvent } from './types';
import { BookCheck, Brain, Star } from 'lucide-react';

export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  xp: number;
  getProgress: (events: QuestEvent[]) => { current: number, goal: number };
}

export const dailyQuestsList: Quest[] = [
  {
    id: 'complete-session',
    name: 'Daily Check-in',
    description: 'Complete one study session.',
    icon: BookCheck,
    xp: 15,
    getProgress: (events) => ({
      current: events.filter(e => e.type === 'SESSION_COMPLETE').length,
      goal: 1,
    }),
  },
  {
    id: 'ten-correct',
    name: 'Brainiac',
    description: 'Answer 10 questions correctly.',
    icon: Brain,
    xp: 20,
    getProgress: (events) => ({
      current: events.filter(e => e.type === 'CORRECT_ANSWER').length,
      goal: 10,
    }),
  },
  {
    id: 'three-subjects',
    name: 'Versatile Learner',
    description: 'Review questions from 3 different subjects.',
    icon: Star,
    xp: 25,
    getProgress: (events) => {
      const subjects = new Set(
        events.filter(e => e.type === 'CORRECT_ANSWER' && e.subject).map(e => e.subject!)
      );
      return { current: subjects.size, goal: 3 };
    },
  }
];
