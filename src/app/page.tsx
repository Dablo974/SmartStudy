
"use client"; // Required for useEffect and localStorage access

import { AppLayout } from '@/components/layout/AppLayout';
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import type { UserProgress, MCQ } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const LOCAL_STORAGE_MCQS_KEY = 'smartStudyProAllMcqs';

// Default mock data if localStorage is empty or not ready
const initialMockUserProgress: UserProgress = {
  totalQuestionsStudied: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  accuracy: 0,
  currentStreak: 5, // Kept from original mock for now
  longestStreak: 12, // Kept from original mock for now
  lastStudiedDate: new Date().toISOString(), // Kept from original mock for now
  topicMastery: {},
};

export default function DashboardPage() {
  const [userProgress, setUserProgress] = useState<UserProgress>(initialMockUserProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedMcqs = localStorage.getItem(LOCAL_STORAGE_MCQS_KEY);
      if (storedMcqs) {
        const allMcqs: MCQ[] = JSON.parse(storedMcqs).map((mcq: MCQ) => ({
          ...mcq,
          timesCorrect: mcq.timesCorrect || 0,
          timesIncorrect: mcq.timesIncorrect || 0,
        }));

        if (allMcqs.length > 0) {
          const totalQuestionsStudied = allMcqs.filter(q => q.lastReviewedSession !== undefined).length;
          const correctAnswers = allMcqs.reduce((sum, q) => sum + q.timesCorrect, 0);
          const incorrectAnswers = allMcqs.reduce((sum, q) => sum + q.timesIncorrect, 0);
          const totalAnswered = correctAnswers + incorrectAnswers;
          const accuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

          const topicMastery: { [topic: string]: number } = {};
          const questionsByTopic: { [topic: string]: { total: number, correct: number } } = {};

          allMcqs.forEach(q => {
            if (q.subject) {
              if (!questionsByTopic[q.subject]) {
                questionsByTopic[q.subject] = { total: 0, correct: 0 };
              }
              // Consider a question contributing to topic mastery if it has been answered at least once
              const answeredInTopic = q.timesCorrect + q.timesIncorrect;
              if (answeredInTopic > 0) {
                 questionsByTopic[q.subject].total += answeredInTopic; // Total attempts for this topic
                 questionsByTopic[q.subject].correct += q.timesCorrect; // Total correct for this topic
              }
            }
          });

          for (const topic in questionsByTopic) {
            if (questionsByTopic[topic].total > 0) {
              topicMastery[topic] = (questionsByTopic[topic].correct / questionsByTopic[topic].total) * 100;
            } else {
              // If a topic exists but has no answered questions yet, mastery is 0
              topicMastery[topic] = 0; 
            }
          }
          
          setUserProgress(prev => ({
            ...prev, // Keep streak data from mock for now
            totalQuestionsStudied,
            correctAnswers,
            incorrectAnswers,
            accuracy,
            topicMastery,
          }));
        } else {
          setUserProgress(initialMockUserProgress); // No questions, use initial state
        }
      } else {
         setUserProgress(initialMockUserProgress); // No stored MCQs, use initial state
      }
    } catch (e) {
      console.error("Failed to load or process dashboard data from localStorage", e);
      setUserProgress(initialMockUserProgress); // Fallback on error
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
            <ProgressChart topicMastery={userProgress.topicMastery} /> 
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Start Studying</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 text-center h-[calc(100%-4rem)]"> {/* Adjust height based on card header */}
              <p className="text-muted-foreground">
                Ready for your next session? Jump in and keep learning!
              </p>
              <Link href="/study" passHref>
                <Button size="lg" className="w-full max-w-xs">
                  Start Study Session
                </Button>
              </Link>
               <p className="text-sm text-muted-foreground pt-4">
                Or, upload more questions to expand your knowledge base.
              </p>
              <Link href="/upload" passHref>
                <Button variant="outline" size="lg" className="w-full max-w-xs">
                  Upload MCQs
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
            <CardContent className="pt-0"> {/* Adjusted padding */}
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
