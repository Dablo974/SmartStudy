
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { QuestionDisplay } from '@/components/study/QuestionDisplay';
import type { MCQ } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Zap, CalendarCheck2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const REVIEW_INTERVALS_SESSIONS = [1, 2, 4, 6, 8]; // Spaced repetition intervals in sessions

// Initial set of MCQs (mock data) - only used if localStorage is empty
const initialMcqsFromMock: Omit<MCQ, 'nextReviewSession' | 'intervalIndex' | 'lastReviewedSession'>[] = [
  { id: '1', question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswerIndex: 2, subject: 'Geography', explanation: 'Paris is the capital and most populous city of France.' },
  { id: '2', question: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswerIndex: 1, subject: 'Astronomy', explanation: 'Mars is often called the Red Planet because of its reddish appearance.' },
  { id: '3', question: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], correctAnswerIndex: 1, subject: 'Chemistry', explanation: 'H2O represents two hydrogen atoms and one oxygen atom.' },
  { id: '4', question: 'Who wrote "Hamlet"?', options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'], correctAnswerIndex: 1, subject: 'Literature', explanation: 'Hamlet is a tragedy written by William Shakespeare.' },
  { id: '5', question: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctAnswerIndex: 2, subject: 'Mathematics', explanation: 'The square root of 64 is 8, because 8 * 8 = 64.' },
];

const LOCAL_STORAGE_MCQS_KEY = 'smartStudyProAllMcqs';
const LOCAL_STORAGE_SESSION_KEY = 'smartStudyProCurrentSession';


export default function StudySessionPage() {
  const [allMcqs, setAllMcqs] = useState<MCQ[] | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<MCQ[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [initialSessionQuestionCount, setInitialSessionQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSessionNumber, setCurrentSessionNumber] = useState<number | null>(null);
  const prevSessionNumberRef = useRef<number | null>(null);

  // Effect for initial loading from localStorage or setting defaults
  useEffect(() => {
    setIsLoading(true);
    let loadedMcqs: MCQ[] | null = null;
    try {
      const storedMcqs = localStorage.getItem(LOCAL_STORAGE_MCQS_KEY);
      if (storedMcqs) {
        loadedMcqs = JSON.parse(storedMcqs);
      }
    } catch (e) { console.error("Failed to parse MCQs from localStorage", e); }

    if (loadedMcqs && loadedMcqs.length > 0) {
      setAllMcqs(loadedMcqs);
    } else {
      const initializedMcqs = initialMcqsFromMock.map((mcq) => ({
        ...mcq,
        nextReviewSession: 1, // Due in the first session
        intervalIndex: 0,
        lastReviewedSession: undefined,
      }));
      setAllMcqs(initializedMcqs);
      localStorage.setItem(LOCAL_STORAGE_MCQS_KEY, JSON.stringify(initializedMcqs));
    }

    let loadedSessionNumber: number | null = null;
    try {
      const storedSessionNum = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (storedSessionNum) {
        const parsedNum = parseInt(storedSessionNum, 10);
        if (!isNaN(parsedNum)) {
          loadedSessionNumber = parsedNum;
        }
      }
    } catch (e) { console.error("Failed to parse session number from localStorage", e); }

    if (loadedSessionNumber) {
      setCurrentSessionNumber(loadedSessionNumber);
    } else {
      setCurrentSessionNumber(1);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, '1');
    }
    // setIsLoading(false) will be handled by the session setup effect
  }, []);

  // Effect to save allMcqs to localStorage
  useEffect(() => {
    if (allMcqs !== null && !isLoading) { 
      localStorage.setItem(LOCAL_STORAGE_MCQS_KEY, JSON.stringify(allMcqs));
    }
  }, [allMcqs, isLoading]);

  // Effect to save currentSessionNumber to localStorage
  useEffect(() => {
    if (currentSessionNumber !== null && !isLoading) {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, currentSessionNumber.toString());
    }
  }, [currentSessionNumber, isLoading]);
  
  // Effect to set up session questions when currentSessionNumber changes or allMcqs are initially loaded
  useEffect(() => {
    if (allMcqs === null || currentSessionNumber === null) {
      setIsLoading(true); 
      return;
    }

    // Only re-initialize the session if the session number has actually changed.
    if (prevSessionNumberRef.current !== currentSessionNumber) {
      setIsLoading(true); 
      const dueQuestions = allMcqs
        .filter(q => q.nextReviewSession <= currentSessionNumber)
        .sort((a, b) => a.nextReviewSession - b.nextReviewSession || (a.lastReviewedSession || 0) - (b.lastReviewedSession || 0) || a.id.localeCompare(b.id));

      setSessionQuestions(dueQuestions);
      setInitialSessionQuestionCount(dueQuestions.length);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResults(false); 
      setIsAnswerSubmitted(false);
      prevSessionNumberRef.current = currentSessionNumber;
      setIsLoading(false);
    } else if (isLoading) {
      // Catchall for initial load where allMcqs and currentSessionNumber are set but effect didn't run new session logic.
      // This ensures isLoading is false if it was true from initial guards.
      setIsLoading(false);
    }
  }, [allMcqs, currentSessionNumber, isLoading]);


  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (!sessionQuestions[currentQuestionIndex] || currentSessionNumber === null) return;
    
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
      (prevAllMcqs || []).map(q => {
        if (q.id === currentQuestionId) {
          let newIntervalIndex = q.intervalIndex;

          if (isCorrect) {
            newIntervalIndex = q.intervalIndex + 1;
            if (newIntervalIndex >= REVIEW_INTERVALS_SESSIONS.length) {
              newIntervalIndex = REVIEW_INTERVALS_SESSIONS.length - 1;
            }
          } else {
            newIntervalIndex = 0; 
          }
          
          const sessionsToWait = REVIEW_INTERVALS_SESSIONS[newIntervalIndex];
          const nextSessionForReview = currentSessionNumber + sessionsToWait;
          
          return {
            ...q,
            intervalIndex: newIntervalIndex,
            nextReviewSession: nextSessionForReview,
            lastReviewedSession: currentSessionNumber,
          };
        }
        return q;
      })
    );
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < initialSessionQuestionCount - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartSession = () => {
    if (allMcqs === null || currentSessionNumber === null) return;
    setIsLoading(true);
     const dueQuestions = allMcqs
      .filter(q => q.nextReviewSession <= currentSessionNumber)
      .sort((a, b) => a.nextReviewSession - b.nextReviewSession || (a.lastReviewedSession || 0) - (b.lastReviewedSession || 0) || a.id.localeCompare(b.id));
    setSessionQuestions(dueQuestions);
    setInitialSessionQuestionCount(dueQuestions.length);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswerSubmitted(false);
    setIsLoading(false);
    // prevSessionNumberRef.current needs to be "reset" conceptually for restart,
    // so we set it to null to force re-evaluation in the main useEffect if session number hasn't changed
    // or simply re-trigger session setup. Simpler: just ensure session state is fully reset.
    // The existing logic of setting currentSessionNumber then prevSessionNumberRef.current should handle this fine
    // if we are truly "restarting" the same session number.
    // For "Study these questions again", we are re-filtering for the *current* session number.
  };

  const handleStartNextSession = () => {
    // prevSessionNumberRef will be different from the new currentSessionNumber, triggering session setup
    setCurrentSessionNumber(prev => (prev ? prev + 1 : 1)); 
    // setShowResults(false) is handled by the useEffect for session setup
  };


  if (isLoading || allMcqs === null || currentSessionNumber === null) {
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

  // This check should use initialSessionQuestionCount once it's set
  if (initialSessionQuestionCount === 0 && !showResults && !isLoading) {
    return (
      <AppLayout pageTitle={`Study Session ${currentSessionNumber}`}>
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
           <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CalendarCheck2 className="w-8 h-8 text-green-500" />
                All Caught Up for Session {currentSessionNumber}!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                There are no questions due for study in this session. Great job staying on top of your reviews!
              </p>
              <Button onClick={handleStartNextSession} className="w-full">
                Start Next Session (Session {currentSessionNumber + 1})
              </Button>
              <Link href="/" passHref>
                <Button variant="outline" className="w-full mt-2">
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const progressPercentage = (initialSessionQuestionCount > 0 ? ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / initialSessionQuestionCount) * 100 : 0);

  if (showResults) {
    return (
      <AppLayout pageTitle={`Results for Session ${currentSessionNumber}`}>
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Session {currentSessionNumber} Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl">
                You scored {score} out of {initialSessionQuestionCount}.
              </p>
              <div className="flex justify-around text-lg">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle /> <span>{score} Correct</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle /> <span>{initialSessionQuestionCount - score} Incorrect</span>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Button onClick={restartSession} className="w-full">
                  Study These Questions Again
                </Button>
                <Button onClick={handleStartNextSession} className="w-full mt-2">
                   Start Next Session (Session {currentSessionNumber + 1})
                </Button>
                <Link href="/" passHref>
                  <Button variant="outline" className="w-full mt-2">
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
    <AppLayout pageTitle={isLoading ? "Study Session" : `Study Session ${currentSessionNumber}`}>
      <div className="flex flex-col items-center space-y-6">
        <Progress value={progressPercentage} className="w-full max-w-2xl" />
        {sessionQuestions.length > 0 && currentQuestionIndex < sessionQuestions.length && initialSessionQuestionCount > 0 && (
          <QuestionDisplay
            question={sessionQuestions[currentQuestionIndex]}
            onAnswerSubmit={handleAnswerSubmit}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={initialSessionQuestionCount}
          />
        )}
        {isAnswerSubmitted && (
          <Button onClick={handleNextQuestion} size="lg" className="min-w-[200px]">
            {currentQuestionIndex < initialSessionQuestionCount - 1 ? 'Next Question' : 'View Results'}
          </Button>
        )}
      </div>
    </AppLayout>
  );
}

