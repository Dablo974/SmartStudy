
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { QuestionDisplay } from '@/components/study/QuestionDisplay';
import type { MCQ, McqSet, ExamAnswer } from '@/lib/types';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ClipboardCheck, Loader2, PlayCircle, BarChart, CheckCircle, XCircle, TimerIcon, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';
const TIMER_OPTIONS = [
  { value: '15', label: '15 Secondes' },
  { value: '30', label: '30 Secondes' },
  { value: '45', label: '45 Secondes' },
  { value: '60', label: '60 Secondes' },
  { value: 'null', label: 'Pas de minuteur' },
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function ExamModePage() {
  const [allMcqs, setAllMcqs] = useState<MCQ[]>([]);
  const [examQuestions, setExamQuestions] = useState<MCQ[]>([]);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timerDurationSeconds, setTimerDurationSeconds] = useState<number | null>(30);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>([]);
  const [showResultsScreen, setShowResultsScreen] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const storedSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
      if (storedSetsString) {
        const loadedMcqSets: McqSet[] = JSON.parse(storedSetsString);
        const activeMcqs = loadedMcqSets
          .filter(set => set.isActive)
          .reduce((acc, set) => acc.concat(set.mcqs), [] as MCQ[]);
        setAllMcqs(activeMcqs);
      }
    } catch (e) {
      console.error("Failed to load MCQs from localStorage", e);
    }
    setIsLoading(false);
  }, []);

  const handleStartExam = () => {
    if (allMcqs.length === 0) return;
    setExamQuestions(shuffleArray(allMcqs));
    setCurrentQuestionIndex(0);
    setExamAnswers([]);
    setShowResultsScreen(false);
    setIsAnswerSubmitted(false);
    setIsExamStarted(true);
  };
  
  const handleAnswerSubmit = useCallback((isCorrect: boolean, selectedIndex: number | null) => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    
    const currentQuestion = examQuestions[currentQuestionIndex];
    setExamAnswers(prev => [...prev, {
      question: currentQuestion,
      userAnswerIndex: selectedIndex,
      isCorrect: isCorrect,
    }]);
    setIsAnswerSubmitted(true);
  }, [examQuestions, currentQuestionIndex]);

  useEffect(() => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    
    if (isExamStarted && !isAnswerSubmitted && timerDurationSeconds) {
      setRemainingTime(timerDurationSeconds);
      timerIdRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timerIdRef.current!);
            handleAnswerSubmit(false, null); // Timed out, incorrect, no answer selected
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isExamStarted, currentQuestionIndex, isAnswerSubmitted, timerDurationSeconds, handleAnswerSubmit]);

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResultsScreen(true);
      setIsExamStarted(false);
    }
  };

  const handleResetExam = () => {
    setIsExamStarted(false);
    setShowResultsScreen(false);
    setExamQuestions([]);
    setCurrentQuestionIndex(0);
    setExamAnswers([]);
  }

  const handleExit = () => {
    if (isExamStarted && !showResultsScreen) {
        setIsExitDialogOpen(true);
    } else {
        handleResetExam();
    }
  }

  const score = useMemo(() => examAnswers.filter(r => r.isCorrect).length, [examAnswers]);
  const progressPercentage = examQuestions.length > 0 ? ((currentQuestionIndex + 1) / examQuestions.length) * 100 : 0;

  if (isLoading) {
    return (
      <AppLayout pageTitle="Mode Examen">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Loader2 className="w-16 h-16 text-accent mb-4 animate-spin" />
          <h2 className="text-2xl font-semibold mb-2">Chargement des questions...</h2>
        </div>
      </AppLayout>
    );
  }

  if (showResultsScreen) {
    return (
      <AppLayout pageTitle="Résultats de l'Examen">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl animate-in fade-in">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2"><BarChart/>Résultats de l'examen</CardTitle>
              <CardDescription>Vous avez terminé l'examen. Voici votre performance.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-3xl font-bold">Votre score : {score} / {examQuestions.length}</p>
              <div className="flex justify-around text-lg">
                <div className="flex items-center space-x-2 text-green-600 font-semibold">
                  <CheckCircle /> <span>{score} Correct</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600 font-semibold">
                  <XCircle /> <span>{examQuestions.length - score} Incorrect</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button onClick={handleResetExam} className="w-full max-w-sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Revenir à la configuration
              </Button>
               <Button asChild variant="outline" className="w-full max-w-sm">
                  <Link href="/">Retour au tableau de bord</Link>
                </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6 shadow-xl animate-in fade-in delay-100">
            <CardHeader>
              <CardTitle>Révision des réponses</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <ul className="space-y-3">
                        {examAnswers.map(({ question, userAnswerIndex, isCorrect }, index) => (
                            <li key={question.id} className="p-3 rounded-md bg-muted/50 border-l-4" style={{ borderLeftColor: isCorrect ? 'hsl(var(--chart-4))' : 'hsl(var(--destructive))' }}>
                                <p className="font-medium">{index + 1}. {question.question}</p>
                                <div className="text-xs mt-2">
                                    <p>Votre réponse : <span className={cn(isCorrect ? "text-green-600" : "text-red-600")}>{userAnswerIndex !== null ? question.options[userAnswerIndex] : "Pas de réponse (temps écoulé)"}</span></p>
                                    {!isCorrect && <p>Réponse correcte : <span className="text-green-600">{question.options[question.correctAnswerIndex]}</span></p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!isExamStarted) {
    return (
      <AppLayout pageTitle="Mode Examen">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg shadow-xl animate-in fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardCheck/>Configuration de l'Examen</CardTitle>
              <CardDescription>Préparez-vous à tester vos connaissances. Toutes les questions actives seront incluses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <p className="font-medium">Nombre total de questions</p>
                <p className="text-2xl font-bold text-accent">{allMcqs.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="timer-select" className="font-medium">Minuteur par question</label>
                <Select
                  value={timerDurationSeconds === null ? 'null' : String(timerDurationSeconds)}
                  onValueChange={(value) => setTimerDurationSeconds(value === 'null' ? null : parseInt(value, 10))}
                >
                  <SelectTrigger id="timer-select" className="w-[180px]">
                    <SelectValue placeholder="Choisir un temps" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMER_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              {allMcqs.length > 0 ? (
                <Button onClick={handleStartExam} size="lg" className="w-full">
                  <PlayCircle className="mr-2 h-5 w-5"/> Commencer l'examen
                </Button>
              ) : (
                <div className="text-center w-full space-y-2">
                    <p className="text-sm text-muted-foreground">Aucune question n'a été chargée. Veuillez d'abord téléverser un QCM.</p>
                    <Button asChild><Link href="/upload">Téléverser des questions</Link></Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];

  return (
    <AppLayout pageTitle="Mode Examen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-2xl space-y-2">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} sur {examQuestions.length}</span>
                <button onClick={handleExit} className="text-xs hover:underline">Quitter l'examen</button>
            </div>
            <Progress value={progressPercentage} />
        </div>

        <QuestionDisplay
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswerSubmit={(isCorrect, selectedIndex) => handleAnswerSubmit(isCorrect, selectedIndex)}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={examQuestions.length}
          remainingTime={remainingTime}
          isExamMode={true}
        />
        {isAnswerSubmitted && (
          <Button onClick={handleNextQuestion} size="lg" className="min-w-[200px] animate-in fade-in">
            {currentQuestionIndex < examQuestions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
          </Button>
        )}
      </div>
       <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir quitter ?</AlertDialogTitle>
            <AlertDialogDescription>
              Votre progression dans cet examen sera perdue. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rester</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetExam} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Quitter l'examen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
