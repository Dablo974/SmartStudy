
"use client"; 

import { AppLayout } from '@/components/layout/AppLayout';
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import type { UserProgress, MCQ, McqSet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { SetMasteryDetails } from '@/components/dashboard/SetMasteryDetails';
import { MasteryLegend } from '@/components/dashboard/MasteryLegend';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';

const initialUserProgress: UserProgress = {
  totalQuestionsStudied: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  setMastery: {},
};

export default function DashboardPage() {
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [allMcqSets, setAllMcqSets] = useState<McqSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedMcqSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
      if (storedMcqSetsString) {
        const loadedMcqSets: McqSet[] = JSON.parse(storedMcqSetsString);
        setAllMcqSets(loadedMcqSets);
        
        const activeMcqsOverall: MCQ[] = loadedMcqSets
          .filter(set => set.isActive)
          .reduce((acc, set) => acc.concat(set.mcqs), [] as MCQ[]);

        if (activeMcqsOverall.length > 0) {
          const totalQuestionsStudied = activeMcqsOverall.filter(q => q.lastReviewedSession !== undefined).length;
          const correctAnswers = activeMcqsOverall.reduce((sum, q) => sum + (q.timesCorrect || 0), 0);
          const incorrectAnswers = activeMcqsOverall.reduce((sum, q) => sum + (q.timesIncorrect || 0), 0);
          
          const setMastery: { [setName: string]: number } = {};
          
          loadedMcqSets.filter(set => set.isActive).forEach(set => {
            let questionsInSetCorrect = 0;
            let questionsInSetTotalAnswered = 0;
            set.mcqs.forEach(mcq => {
              const answeredInThisMcq = (mcq.timesCorrect || 0) + (mcq.timesIncorrect || 0);
              if (answeredInThisMcq > 0) { 
                questionsInSetTotalAnswered += answeredInThisMcq;
                questionsInSetCorrect += (mcq.timesCorrect || 0);
              }
            });
            if (questionsInSetTotalAnswered > 0) {
              setMastery[set.fileName] = (questionsInSetCorrect / questionsInSetTotalAnswered) * 100;
            } else {
              setMastery[set.fileName] = 0;
            }
          });
          
          setUserProgress({
            totalQuestionsStudied,
            correctAnswers,
            incorrectAnswers,
            setMastery,
          });
        } else {
          setUserProgress(initialUserProgress); 
        }
      } else {
         setUserProgress(initialUserProgress); 
         setAllMcqSets([]);
      }
    } catch (e) {
      console.error("Failed to load or process dashboard data from localStorage", e);
      setUserProgress(initialUserProgress); 
      setAllMcqSets([]);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <AppLayout pageTitle="Dashboard">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Zap className="w-16 h-16 text-accent mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Fetching your progress.</p>
        </div>
      </AppLayout>
    );
  }

  const sortedSetMastery = Object.entries(userProgress.setMastery || {})
    .sort(([, masteryA], [, masteryB]) => masteryA - masteryB); // Sort by lowest mastery first

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <PerformanceSummary progress={userProgress} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-100">
            <ProgressChart setMastery={userProgress.setMastery || {}} /> 
          </div>
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-200">
            <CardHeader>
              <CardTitle>Start Studying</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 text-center h-[calc(100%-4rem)]">
              <p className="text-muted-foreground">
                Ready for your next session? Jump in and keep learning!
              </p>
              <Link href="/study" passHref>
                <Button size="lg" className="w-full max-w-xs">
                  Start Study Session
                </Button>
              </Link>
               <p className="text-sm text-muted-foreground pt-4">
                Or, manage your question sets and upload more.
              </p>
              <Link href="/manage-questions" passHref>
                <Button variant="outline" size="lg" className="w-full max-w-xs">
                  Manage Questions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allMcqSets.length > 0 && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-300">
              <CardHeader>
                <CardTitle>Set Mastery (Lowest First)</CardTitle>
                <CardDescription>Click on a set to see question-level mastery.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                  <SetMasteryDetails sets={allMcqSets.filter(s => s.isActive)} sortedMastery={sortedSetMastery} />
              </CardContent>
            </Card>
          )}

          <div className={cn(
              "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-400",
              allMcqSets.length === 0 && "lg:col-span-2"
            )}>
              <MasteryLegend />
            </div>
        </div>

      </div>
    </AppLayout>
  );
}
