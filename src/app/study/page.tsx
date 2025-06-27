
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { QuestionDisplay } from '@/components/study/QuestionDisplay';
import type { MCQ, McqSet } from '@/lib/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Zap, CalendarCheck2, TimerIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const REVIEW_INTERVALS_SESSIONS = [1, 2, 4, 6, 8]; 

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';
const LOCAL_STORAGE_SESSION_KEY = 'smartStudyProCurrentSession';

const initialMockMcqSet: McqSet = {
  id: 'mock-set-initial',
  fileName: 'Sample Questions',
  uploadDate: new Date().toISOString(),
  isActive: true,
  mcqs: [
    { id: 'mock-1', question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswerIndex: 2, subject: 'Geography', explanation: 'Paris is the capital and most populous city of France.', nextReviewSession: 1, intervalIndex: 0, timesCorrect: 0, timesIncorrect: 0 },
    { id: 'mock-2', question: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswerIndex: 1, subject: 'Astronomy', explanation: 'Mars is often called the Red Planet because of its reddish appearance.', nextReviewSession: 1, intervalIndex: 0, timesCorrect: 0, timesIncorrect: 0 },
    { id: 'mock-3', question: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], correctAnswerIndex: 1, subject: 'Chemistry', explanation: 'H2O represents two hydrogen atoms and one oxygen atom.', nextReviewSession: 1, intervalIndex: 0, timesCorrect: 0, timesIncorrect: 0 },
  ]
};

const TIMER_OPTIONS = [
  { value: 'null', label: 'No Timer' },
  { value: '15', label: '15 Seconds' },
  { value: '30', label: '30 Seconds' },
  { value: '45', label: '45 Seconds' },
  { value: '60', label: '60 Seconds' },
];

export default function StudySessionPage() {
  const [allMcqSets, setAllMcqSets] = useState<McqSet[] | null>(null);
  const [allMcqsFlat, setAllMcqsFlat] = useState<MCQ[]>([]);
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

  const [timerDurationSeconds, setTimerDurationSeconds] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoading(true);
    let mcqSetsToUse: McqSet[];

    const storedSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);

    if (storedSetsString === null) {
      mcqSetsToUse = [initialMockMcqSet];
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(mcqSetsToUse));
    } else {
      try {
        const parsedSets = JSON.parse(storedSetsString);
        if (Array.isArray(parsedSets)) {
          mcqSetsToUse = parsedSets.map((set: any) => ({
            id: set.id || `set-${Date.now()}-${Math.random()}`,
            fileName: set.fileName || "Unknown File",
            uploadDate: set.uploadDate || new Date().toISOString(),
            isActive: typeof set.isActive === 'boolean' ? set.isActive : true,
            mcqs: Array.isArray(set.mcqs) ? set.mcqs.map((mcq: any) => ({
              id: mcq.id || `mcq-${Date.now()}-${Math.random()}`,
              question: mcq.question || "Default Question Text",
              options: Array.isArray(mcq.options) && mcq.options.length === 4 ? mcq.options : ["A", "B", "C", "D"],
              correctAnswerIndex: typeof mcq.correctAnswerIndex === 'number' ? mcq.correctAnswerIndex : 0,
              subject: mcq.subject,
              explanation: mcq.explanation,
              nextReviewSession: typeof mcq.nextReviewSession === 'number' ? mcq.nextReviewSession : 1,
              intervalIndex: typeof mcq.intervalIndex === 'number' ? mcq.intervalIndex : 0,
              lastReviewedSession: mcq.lastReviewedSession,
              timesCorrect: typeof mcq.timesCorrect === 'number' ? mcq.timesCorrect : 0,
              timesIncorrect: typeof mcq.timesIncorrect === 'number' ? mcq.timesIncorrect : 0,
            })) : [],
          }));
        } else {
          mcqSetsToUse = []; 
          localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(mcqSetsToUse));
        }
      } catch (e) {
        mcqSetsToUse = [];
        localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(mcqSetsToUse));
      }
    }
    setAllMcqSets(mcqSetsToUse);

    let loadedSessionNumber: number | null = null;
    try {
      const storedSessionNum = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (storedSessionNum) {
        const parsedNum = parseInt(storedSessionNum, 10);
        if (!isNaN(parsedNum)) loadedSessionNumber = parsedNum;
      }
    } catch (e) { console.error("Failed to parse session number", e); }

    setCurrentSessionNumber(loadedSessionNumber || 1);
    if (!loadedSessionNumber) {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, '1');
    }
  }, []);

  useEffect(() => {
    if (allMcqSets !== null && !isLoading) { 
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(allMcqSets));
    }
  }, [allMcqSets, isLoading]);

  useEffect(() => {
    if (currentSessionNumber !== null && !isLoading) {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, currentSessionNumber.toString());
    }
  }, [currentSessionNumber, isLoading]);

  useEffect(() => {
    if (allMcqSets === null || currentSessionNumber === null) {
      setIsLoading(true);
      return;
    }

    const activeMcqs = allMcqSets
      .filter(set => set.isActive)
      .reduce((acc, set) => acc.concat(set.mcqs), [] as MCQ[]);
    setAllMcqsFlat(activeMcqs);

    if (prevSessionNumberRef.current !== currentSessionNumber) {
      setIsLoading(true); // Always start loading when we intend to change the session

      const dueQuestions = activeMcqs
        .filter(q => q.nextReviewSession <= currentSessionNumber)
        .sort((a, b) => a.nextReviewSession - b.nextReviewSession || (a.lastReviewedSession || 0) - (b.lastReviewedSession || 0) || a.id.localeCompare(b.id));

      if (dueQuestions.length > 0) {
        // We found questions for this session number. Load the session.
        setSessionQuestions(dueQuestions);
        setInitialSessionQuestionCount(dueQuestions.length);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResults(false);
        setIsAnswerSubmitted(false);
        prevSessionNumberRef.current = currentSessionNumber;
        setIsLoading(false);
      } else {
        // No questions due for the current session.
        if (activeMcqs.length > 0) {
          const futureSessionNumbers = activeMcqs
            .map(q => q.nextReviewSession)
            .filter(sessionNum => sessionNum > currentSessionNumber);

          if (futureSessionNumbers.length > 0) {
            // There are questions in a future session. Jump to the next available one.
            const nextAvailableSession = Math.min(...futureSessionNumbers);
            // This will cause the effect to re-run with the new session number.
            // We leave isLoading=true to show the loading state during the jump.
            setCurrentSessionNumber(nextAvailableSession);
          } else {
            // No questions due now, and no questions scheduled for the future.
            // This is the "All caught up" state. Load an empty session.
            setSessionQuestions([]);
            setInitialSessionQuestionCount(0);
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResults(false);
            setIsAnswerSubmitted(false);
            prevSessionNumberRef.current = currentSessionNumber;
            setIsLoading(false);
          }
        } else {
          // There are no active questions at all. Load an empty session.
          setSessionQuestions([]);
          setInitialSessionQuestionCount(0);
          setCurrentQuestionIndex(0);
          setScore(0);
          setShowResults(false);
          setIsAnswerSubmitted(false);
          prevSessionNumberRef.current = currentSessionNumber;
          setIsLoading(false);
        }
      }
    } else if (isLoading) {
      // This handles cases where the effect re-runs but the session number hasn't changed.
      setIsLoading(false);
    }
  }, [allMcqSets, currentSessionNumber, isLoading]);

  const handleAnswerSubmit = useCallback((isCorrect: boolean, fromTimeout: boolean = false) => {
    if (!sessionQuestions[currentQuestionIndex] || currentSessionNumber === null || allMcqSets === null) return;
    
    const currentQuestionId = sessionQuestions[currentQuestionIndex].id;

    setAllMcqSets(prevSets => 
      (prevSets || []).map(set => {
        const mcqIndex = set.mcqs.findIndex(mcq => mcq.id === currentQuestionId);
        if (mcqIndex === -1) return set;

        const q = set.mcqs[mcqIndex];
        let newIntervalIndex = q.intervalIndex;
        let newTimesCorrect = q.timesCorrect;
        let newTimesIncorrect = q.timesIncorrect;

        if (isCorrect) {
          newTimesCorrect++;
          newIntervalIndex = q.intervalIndex + 1;
          if (newIntervalIndex >= REVIEW_INTERVALS_SESSIONS.length) {
            newIntervalIndex = REVIEW_INTERVALS_SESSIONS.length - 1;
          }
        } else {
          newTimesIncorrect++;
          newIntervalIndex = 0; 
        }
        
        const sessionsToWait = REVIEW_INTERVALS_SESSIONS[newIntervalIndex];
        const nextSessionForReview = currentSessionNumber + sessionsToWait;
        
        const updatedMcq = {
          ...q,
          intervalIndex: newIntervalIndex,
          nextReviewSession: nextSessionForReview,
          lastReviewedSession: currentSessionNumber,
          timesCorrect: newTimesCorrect,
          timesIncorrect: newTimesIncorrect,
        };
        
        const updatedMcqsInSet = [...set.mcqs];
        updatedMcqsInSet[mcqIndex] = updatedMcq;
        return { ...set, mcqs: updatedMcqsInSet };
      })
    );
    
    if (fromTimeout) {
      toast({
        title: "Time's Up!",
        description: "The answer was marked as incorrect.",
        variant: "destructive",
      });
    } else if (isCorrect) {
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
    setIsAnswerSubmitted(true);
  }, [sessionQuestions, currentQuestionIndex, currentSessionNumber, allMcqSets, toast]);


  useEffect(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    if (timerDurationSeconds && sessionQuestions.length > 0 && currentQuestionIndex < sessionQuestions.length && !isAnswerSubmitted && !showResults) {
      setIsTimerActive(true);
      setRemainingTime(timerDurationSeconds);

      timerIdRef.current = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime === null) {
            clearInterval(timerIdRef.current!);
            timerIdRef.current = null;
            setIsTimerActive(false);
            return null;
          }
          if (prevTime <= 1) {
            clearInterval(timerIdRef.current!);
            timerIdRef.current = null;
            setIsTimerActive(false);
            handleAnswerSubmit(false, true); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setIsTimerActive(false);
      setRemainingTime(null);
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [currentQuestionIndex, timerDurationSeconds, isAnswerSubmitted, sessionQuestions, showResults, handleAnswerSubmit]);


  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < initialSessionQuestionCount - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartSession = () => {
    if (allMcqsFlat === null || currentSessionNumber === null) return;
    setIsLoading(true);
    const dueQuestions = allMcqsFlat
      .filter(q => q.nextReviewSession <= currentSessionNumber)
      .sort((a, b) => a.nextReviewSession - b.nextReviewSession || (a.lastReviewedSession || 0) - (b.lastReviewedSession || 0) || a.id.localeCompare(b.id));
    setSessionQuestions(dueQuestions);
    setInitialSessionQuestionCount(dueQuestions.length);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswerSubmitted(false);
    setIsLoading(false);
  };

  const handleStartNextSession = () => {
    setCurrentSessionNumber(prev => (prev ? prev + 1 : 1)); 
  };

  if (isLoading || allMcqSets === null || currentSessionNumber === null) {
    return (
      <AppLayout pageTitle="Study Session">
        <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-300">
          <Zap className="w-16 h-16 text-accent mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading Questions...</h2>
          <p className="text-muted-foreground">
            Preparing your personalized study session.
          </p>
        </div>
      </AppLayout>
    );
  }
  
  const isTimerSelectDisabled = isLoading || showResults || (sessionQuestions.length > 0 && (currentQuestionIndex > 0 || isAnswerSubmitted));

  if (initialSessionQuestionCount === 0 && !showResults && !isLoading) {
    return (
      <AppLayout pageTitle={`Study Session ${currentSessionNumber}`}>
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
           <div className="mb-4">
              <Label htmlFor="timer-select-empty" className="mr-2 text-sm font-medium text-muted-foreground">Question Timer:</Label>
              <Select
                value={timerDurationSeconds === null ? 'null' : timerDurationSeconds.toString()}
                onValueChange={(value) => {
                  setTimerDurationSeconds(value === 'null' ? null : parseInt(value, 10));
                }}
                disabled={isTimerSelectDisabled}
              >
                <SelectTrigger id="timer-select-empty" className="w-[180px] inline-flex">
                  <SelectValue placeholder="Set timer" />
                </SelectTrigger>
                <SelectContent>
                  {TIMER_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
           <Card className="w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CalendarCheck2 className="w-8 h-8 text-green-500" />
                Excellent ! Session {currentSessionNumber} maîtrisée !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Il n'y a aucune question à réviser. Vous pouvez faire une pause ou, si vous le souhaitez, passer directement à la session suivante.
              </p>
              <Button onClick={handleStartNextSession} className="w-full">
                Start Next Session (Session {currentSessionNumber + 1})
              </Button>
              <Link href="/manage-questions" passHref>
                <Button variant="outline" className="w-full mt-2">
                  Manage Question Sets
                </Button>
              </Link>
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
  const sessionAccuracy = initialSessionQuestionCount > 0 ? (score / initialSessionQuestionCount) * 100 : 0;

  if (showResults) {
    return (
      <AppLayout pageTitle={`Results for Session ${currentSessionNumber}`}>
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Card className="w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <CardHeader>
              <CardTitle className="text-2xl">Session {currentSessionNumber} Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl">
                You scored {score} out of {initialSessionQuestionCount} ({sessionAccuracy.toFixed(1)}%).
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
        <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-2 gap-4">
          <div className="flex-grow w-full sm:w-auto">
             <Progress value={progressPercentage} className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <TimerIcon className="h-5 w-5 text-muted-foreground" />
            <Select
                value={timerDurationSeconds === null ? 'null' : timerDurationSeconds.toString()}
                onValueChange={(value) => {
                  setTimerDurationSeconds(value === 'null' ? null : parseInt(value, 10));
                }}
                disabled={isTimerSelectDisabled}
              >
                <SelectTrigger className="w-[150px] text-sm h-9">
                  <SelectValue placeholder="Set timer" />
                </SelectTrigger>
                <SelectContent>
                  {TIMER_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-sm">{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
        </div>

        {sessionQuestions.length > 0 && currentQuestionIndex < sessionQuestions.length && initialSessionQuestionCount > 0 && (
          <QuestionDisplay
            key={sessionQuestions[currentQuestionIndex].id} 
            question={sessionQuestions[currentQuestionIndex]}
            onAnswerSubmit={(isCorrect) => handleAnswerSubmit(isCorrect, false)}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={initialSessionQuestionCount}
            remainingTime={remainingTime}
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



