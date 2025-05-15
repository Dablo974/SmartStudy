
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { QuestionDisplay } from '@/components/study/QuestionDisplay';
import type { MCQ } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Zap, CalendarCheck2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const REVIEW_INTERVALS_DAYS = [1, 2, 4, 6, 8]; // Spaced repetition intervals in days

// Helper function to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Initial set of MCQs (mock data)
const initialMcqsFromMock: Omit<MCQ, 'dueDate' | 'intervalIndex' | 'lastReviewedDate'>[] = [
  { id: '1', question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswerIndex: 2, subject: 'Geography', explanation: 'Paris is the capital and most populous city of France.' },
  { id: '2', question: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswerIndex: 1, subject: 'Astronomy', explanation: 'Mars is often called the Red Planet because of its reddish appearance.' },
  { id: '3', question: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], correctAnswerIndex: 1, subject: 'Chemistry', explanation: 'H2O represents two hydrogen atoms and one oxygen atom.' },
  { id: '4', question: 'Who wrote "Hamlet"?', options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'], correctAnswerIndex: 1, subject: 'Literature', explanation: 'Hamlet is a tragedy written by William Shakespeare.' },
  { id: '5', question: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctAnswerIndex: 2, subject: 'Mathematics', explanation: 'The square root of 64 is 8, because 8 * 8 = 64.' },
];


export default function StudySessionPage() {
  const [allMcqs, setAllMcqs] = useState<MCQ[]>([]); // Master list of all questions with SRS data
  const [sessionQuestions, setSessionQuestions] = useState<MCQ[]>([]); // Questions for the current study session
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

    // Initialize MCQs with SRS data. In a real app, this might come from localStorage or a backend.
    // For this prototype, we re-initialize from mock data on each load.
    const initializedMcqs = initialMcqsFromMock.map((mcq, index) => ({
      ...mcq,
      // Make all questions due initially for the first session
      dueDate: addDays(today, -1 * (initialMcqsFromMock.length - index)).toISOString(), // Stagger due dates slightly in the past
      intervalIndex: 0, // Start at the first interval
      lastReviewedDate: undefined,
    }));
    setAllMcqs(initializedMcqs);

    const dueQuestions = initializedMcqs
      .filter(q => {
        const dueDate = new Date(q.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate <= today;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Study older due questions first

    setSessionQuestions(dueQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswerSubmitted(false);
    setIsLoading(false);
  }, []);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const currentQuestionId = sessionQuestions[currentQuestionIndex].id;

    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Great job!",
        variant: "default",
        className: "bg-green-500/10 border-green-500 text-green-700 dark:bg-green-500/20 dark:text-green-400",
      });
    } else {
       toast({
        title: "Incorrect",
        description: "Don't worry, keep trying!",
        variant: "destructive",
      });
    }
    
    setAllMcqs(prevAllMcqs => 
      prevAllMcqs.map(q => {
        if (q.id === currentQuestionId) {
          const today = new Date();
          let newIntervalIndex = q.intervalIndex;

          if (isCorrect) {
            newIntervalIndex = q.intervalIndex + 1;
            if (newIntervalIndex >= REVIEW_INTERVALS_DAYS.length) {
              newIntervalIndex = REVIEW_INTERVALS_DAYS.length - 1; // Cap at max interval
            }
          } else {
            newIntervalIndex = 0; // Reset to the first interval
          }
          
          const daysToAdd = REVIEW_INTERVALS_DAYS[newIntervalIndex];
          const nextDueDate = addDays(today, daysToAdd);
          
          return {
            ...q,
            intervalIndex: newIntervalIndex,
            dueDate: nextDueDate.toISOString(),
            lastReviewedDate: today.toISOString(),
          };
        }
        return q;
      })
    );
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartSession = () => {
    // This restarts the current set of questions. 
    // To get a new set based on updated due dates, user would navigate away and back.
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswerSubmitted(false);
  };

  if (isLoading) {
    return (
      <AppLayout pageTitle="Study Session">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Zap className="w-16 h-16 text-accent mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading Questions...</h2>
          <p className="text-muted-foreground">
            Preparing your personalized study session.
          </p>
        </div>
      </AppLayout>
    );
  }

  if (sessionQuestions.length === 0 && !showResults) {
    return (
      <AppLayout pageTitle="Study Session">
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
           <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CalendarCheck2 className="w-8 h-8 text-green-500" />
                All Caught Up!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                There are no questions due for study right now. Great job staying on top of your reviews!
              </p>
              <Link href="/" passHref>
                <Button className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const progressPercentage = (sessionQuestions.length > 0 ? ((currentQuestionIndex + (isAnswerSubmitted ? 1: 0)) / sessionQuestions.length) * 100 : 0);

  if (showResults) {
    return (
      <AppLayout pageTitle="Session Results">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Session Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl">
                You scored {score} out of {sessionQuestions.length}.
              </p>
              <div className="flex justify-around text-lg">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle /> <span>{score} Correct</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle /> <span>{sessionQuestions.length - score} Incorrect</span>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Button onClick={restartSession} className="w-full">
                  Study These Questions Again
                </Button>
                <Link href="/" passHref>
                  <Button variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout pageTitle="Study Session">
      <div className="flex flex-col items-center space-y-6">
        <Progress value={progressPercentage} className="w-full max-w-2xl" />
        {sessionQuestions.length > 0 && currentQuestionIndex < sessionQuestions.length && (
          <QuestionDisplay
            question={sessionQuestions[currentQuestionIndex]}
            onAnswerSubmit={handleAnswerSubmit}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={sessionQuestions.length}
          />
        )}
        {isAnswerSubmitted && (
          <Button onClick={handleNextQuestion} size="lg" className="min-w-[200px]">
            {currentQuestionIndex < sessionQuestions.length - 1 ? 'Next Question' : 'View Results'}
          </Button>
        )}
      </div>
    </AppLayout>
  );
}
