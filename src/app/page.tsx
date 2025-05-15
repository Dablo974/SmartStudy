
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

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';

const initialUserProgress: UserProgress = {
  totalQuestionsStudied: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  accuracy: 0,
  topicMastery: {},
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
        const activeMcqs: MCQ[] = allMcqSets
          .filter(set => set.isActive)
          .reduce((acc, set) => acc.concat(set.mcqs), [] as MCQ[]);

        if (activeMcqs.length > 0) {
          const totalQuestionsStudied = activeMcqs.filter(q => q.lastReviewedSession !== undefined).length;
          const correctAnswers = activeMcqs.reduce((sum, q) => sum + (q.timesCorrect || 0), 0);
          const incorrectAnswers = activeMcqs.reduce((sum, q) => sum + (q.timesIncorrect || 0), 0);
          const totalAnswered = correctAnswers + incorrectAnswers;
          const accuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

          const topicMastery: { [topic: string]: number } = {};
          const questionsByTopic: { [topic: string]: { total: number, correct: number } } = {};

          activeMcqs.forEach(q => {
            if (q.subject) {
              if (!questionsByTopic[q.subject]) {
                questionsByTopic[q.subject] = { total: 0, correct: 0 };
              }
              const answeredInTopic = (q.timesCorrect || 0) + (q.timesIncorrect || 0);
              if (answeredInTopic > 0) {
                 questionsByTopic[q.subject].total += answeredInTopic;
                 questionsByTopic[q.subject].correct += (q.timesCorrect || 0);
              }
            }
          });

          for (const topic in questionsByTopic) {
            if (questionsByTopic[topic].total > 0) {
              topicMastery[topic] = (questionsByTopic[topic].correct / questionsByTopic[topic].total) * 100;
            } else {
              topicMastery[topic] = 0; 
            }
          }
          
          setUserProgress({
            totalQuestionsStudied,
            correctAnswers,
            incorrectAnswers,
            accuracy,
            topicMastery,
          });
        } else {
          setUserProgress(initialUserProgress); // No active questions
        }
      } else {
         setUserProgress(initialUserProgress); // No stored MCQ sets
      }
    } catch (e) {
      console.error("Failed to load or process dashboard data from localStorage", e);
      setUserProgress(initialUserProgress); // Fallback on error
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

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        <PerformanceSummary progress={userProgress} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProgressChart topicMastery={userProgress.topicMastery || {}} /> 
          </div>
          <Card>
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
        
        {userProgress.topicMastery && Object.keys(userProgress.topicMastery).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Topic Mastery Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {Object.entries(userProgress.topicMastery).map(([topic, mastery]) => (
                  <li key={topic} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                    <span className="font-medium text-foreground">{topic}</span>
                    <span className="text-sm font-semibold text-accent">{mastery.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
