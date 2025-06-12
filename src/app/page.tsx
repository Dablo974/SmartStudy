
"use client"; 

import { AppLayout } from '@/components/layout/AppLayout';
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import type { UserProgress, MCQ, McqSet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';
const MAX_SETS_TO_DISPLAY_LIST = 5;

const initialUserProgress: UserProgress = {
  totalQuestionsStudied: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  // accuracy: 0, // Accuracy removed
  setMastery: {},
};

export default function DashboardPage() {
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedMcqSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
      if (storedMcqSetsString) {
        const allMcqSets: McqSet[] = JSON.parse(storedMcqSetsString);
        
        const activeMcqsOverall: MCQ[] = allMcqSets
          .filter(set => set.isActive)
          .reduce((acc, set) => acc.concat(set.mcqs), [] as MCQ[]);

        if (activeMcqsOverall.length > 0) {
          const totalQuestionsStudied = activeMcqsOverall.filter(q => q.lastReviewedSession !== undefined).length;
          const correctAnswers = activeMcqsOverall.reduce((sum, q) => sum + (q.timesCorrect || 0), 0);
          const incorrectAnswers = activeMcqsOverall.reduce((sum, q) => sum + (q.timesIncorrect || 0), 0);
          // const totalAnsweredOverall = correctAnswers + incorrectAnswers; // Not needed if accuracy is removed
          // const accuracy = totalAnsweredOverall > 0 ? (correctAnswers / totalAnsweredOverall) * 100 : 0; // Accuracy removed

          const setMastery: { [setName: string]: number } = {};
          
          allMcqSets.filter(set => set.isActive).forEach(set => {
            let questionsInSetCorrect = 0;
            let questionsInSetTotalAnswered = 0;
            set.mcqs.forEach(mcq => {
              const answeredInThisMcq = (mcq.timesCorrect || 0) + (mcq.timesIncorrect || 0);
              if (answeredInThisMcq > 0) { // Only count questions that have been answered at least once
                questionsInSetTotalAnswered += answeredInThisMcq; // Use total attempts for mastery denominator
                questionsInSetCorrect += (mcq.timesCorrect || 0);
              }
            });
            // Calculate mastery only if there are answered questions in the set
            if (questionsInSetTotalAnswered > 0) {
              setMastery[set.fileName] = (questionsInSetCorrect / questionsInSetTotalAnswered) * 100;
            } else {
              // If no questions answered in the set, mastery is 0 or could be undefined/not shown
              setMastery[set.fileName] = 0; // Or handle this differently, e.g., not including it
            }
          });
          
          setUserProgress({
            totalQuestionsStudied,
            correctAnswers,
            incorrectAnswers,
            // accuracy, // Accuracy removed
            setMastery,
          });
        } else {
          setUserProgress(initialUserProgress); 
        }
      } else {
         setUserProgress(initialUserProgress); 
      }
    } catch (e) {
      console.error("Failed to load or process dashboard data from localStorage", e);
      setUserProgress(initialUserProgress); 
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
        
        {sortedSetMastery.length > 0 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-300">
            <CardHeader>
              <CardTitle>Set Mastery (Lowest First)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {sortedSetMastery
                  .slice(0, MAX_SETS_TO_DISPLAY_LIST)
                  .map(([setName, mastery], index) => (
                  <li 
                    key={setName} 
                    className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
                    style={{ animationDelay: `${index * 75 + 400}ms` }}
                  >
                    <span className="font-medium text-foreground truncate max-w-[70%]">{setName}</span>
                    <span className={cn(
                        "text-sm font-semibold",
                        mastery < 33 ? "text-destructive" : mastery < 66 ? "text-orange-500" : "text-green-500" // Example coloring based on mastery
                      )}>{mastery.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
               {sortedSetMastery.length > MAX_SETS_TO_DISPLAY_LIST && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Showing {MAX_SETS_TO_DISPLAY_LIST} of {sortedSetMastery.length} sets with the lowest mastery.
                </p>
              )}
               {sortedSetMastery.length === 0 && (
                 <p className="text-sm text-muted-foreground text-center py-4">No set mastery data to display yet. Study some questions to see your progress here.</p>
               )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
