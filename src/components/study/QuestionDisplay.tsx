
"use client";

import type { MCQ } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, TimerIcon, BookHeart } from 'lucide-react';

interface QuestionDisplayProps {
  question: MCQ;
  onAnswerSubmit: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
  remainingTime: number | null;
}

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

// Mastery level definitions
const masteryLevels = [
    { level: 'Non Acquis', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' },
    { level: 'En Apprentissage', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    { level: 'Familiarisé', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' },
    { level: 'Acquis', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    { level: 'Maîtrisé', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
];


export function QuestionDisplay({ question, onAnswerSubmit, questionNumber, totalQuestions, remainingTime }: QuestionDisplayProps) {
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);
  const [selectedOriginalIndex, setSelectedOriginalIndex] = useState<number | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const mastery = masteryLevels[question.intervalIndex] ?? masteryLevels[0];

  useEffect(() => {
    if (question && question.options) {
      const optionsWithOriginalIndex = question.options.map((opt, index) => ({
        text: opt,
        originalIndex: index,
      }));

      const newShuffledOptions = [...optionsWithOriginalIndex];
      for (let i = newShuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newShuffledOptions[i], newShuffledOptions[j]] = [newShuffledOptions[j], newShuffledOptions[i]];
      }
      setShuffledOptions(newShuffledOptions);
      
      setSelectedOriginalIndex(undefined);
      setIsSubmitted(false);
      setIsCorrect(null);
    }
  }, [question]);

  const handleSubmit = () => {
    if (selectedOriginalIndex === undefined) {
        alert("Please select an option.");
        return;
    }
    const correct = selectedOriginalIndex === question.correctAnswerIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswerSubmit(correct);
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {questionNumber} <span className="text-muted-foreground text-sm">of {totalQuestions}</span></CardTitle>
          <div className="flex items-center gap-3">
            <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md", mastery.className)}>
              <BookHeart className="h-3.5 w-3.5" />
              {mastery.level}
            </span>
            {remainingTime !== null && (
              <span
                className={cn(
                  "text-sm font-semibold flex items-center gap-1",
                  remainingTime <= 5 && remainingTime > 0 ? "text-destructive animate-pulse" : "text-muted-foreground",
                  remainingTime === 0 && "text-destructive" 
                )}
              >
                <TimerIcon className="h-4 w-4" /> {remainingTime}s
              </span>
            )}
            {question.subject && <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{question.subject}</span>}
          </div>
        </div>
        <CardDescription className="pt-2 text-lg text-foreground">{question.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOriginalIndex?.toString()}
          onValueChange={(value) => setSelectedOriginalIndex(parseInt(value, 10))}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {shuffledOptions.map((optionItem, displayIndex) => {
            const isSelected = selectedOriginalIndex === optionItem.originalIndex;
            const isActuallyCorrectOption = optionItem.originalIndex === question.correctAnswerIndex;
            
            let optionClass = "border-input hover:border-primary";
            if (isSubmitted) {
              if (isActuallyCorrectOption) {
                optionClass = "border-green-500 bg-green-500/10 text-green-700";
              } else if (isSelected && !isActuallyCorrectOption) {
                optionClass = "border-red-500 bg-red-500/10 text-red-700";
              }
            }

            return (
              <Label
                key={optionItem.originalIndex}
                htmlFor={`option-${optionItem.originalIndex}`}
                className={cn(
                  "flex items-center space-x-3 rounded-md border p-4 transition-all cursor-pointer",
                  optionClass,
                  isSubmitted && !isActuallyCorrectOption && !isSelected ? "opacity-60" : "",
                  isSubmitted && isSelected ? "ring-2 ring-offset-1" : "",
                  isSubmitted && isSelected && isActuallyCorrectOption ? "ring-green-500" : "",
                  isSubmitted && isSelected && !isActuallyCorrectOption ? "ring-red-500" : "",
                )}
              >
                <RadioGroupItem value={optionItem.originalIndex.toString()} id={`option-${optionItem.originalIndex}`} className="shrink-0" />
                <span className="font-medium">{getOptionLabel(displayIndex)}.</span>
                <span>{optionItem.text}</span>
                {isSubmitted && isSelected && isActuallyCorrectOption && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                {isSubmitted && isSelected && !isActuallyCorrectOption && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                {isSubmitted && !isSelected && isActuallyCorrectOption && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500 opacity-70" />}
              </Label>
            );
          })}
        </RadioGroup>
        {isSubmitted && question.explanation && (
          <div className={cn(
            "mt-4 p-4 rounded-md text-sm",
            isCorrect ? "bg-green-100/70 dark:bg-green-900/30 border border-green-500/50 text-green-700 dark:text-green-300" : "bg-red-100/70 dark:bg-red-900/30 border border-red-500/50 text-red-700 dark:text-red-300"
          )}>
            <h4 className="font-semibold mb-1">Explanation:</h4>
            <p>{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={selectedOriginalIndex === undefined}>Submit Answer</Button>
        ) : (
          <Button onClick={() => {}} variant="outline" className="opacity-0 pointer-events-none">
             Placeholder Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


