
"use client";

import type { MCQ } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionDisplayProps {
  question: MCQ;
  onAnswerSubmit: (isCorrect: boolean, selectedOriginalOptionIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

export function QuestionDisplay({ question, onAnswerSubmit, questionNumber, totalQuestions }: QuestionDisplayProps) {
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);
  const [selectedOriginalIndex, setSelectedOriginalIndex] = useState<number | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (question && question.options) {
      const optionsWithOriginalIndex = question.options.map((opt, index) => ({
        text: opt,
        originalIndex: index,
      }));

      // Fisher-Yates shuffle algorithm
      const newShuffledOptions = [...optionsWithOriginalIndex];
      for (let i = newShuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newShuffledOptions[i], newShuffledOptions[j]] = [newShuffledOptions[j], newShuffledOptions[i]];
      }
      setShuffledOptions(newShuffledOptions);
      
      // Reset state for new question
      setSelectedOriginalIndex(undefined);
      setIsSubmitted(false);
      setIsCorrect(null);
    }
  }, [question]); // Rerun when the question prop (i.e., its content/ID) changes

  const handleSubmit = () => {
    if (selectedOriginalIndex === undefined) {
        alert("Please select an option.");
        return;
    }
    const correct = selectedOriginalIndex === question.correctAnswerIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswerSubmit(correct, selectedOriginalIndex);
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C, ...

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {questionNumber} <span className="text-muted-foreground text-sm">of {totalQuestions}</span></CardTitle>
          {question.subject && <span className="text-sm font-medium text-accent">{question.subject}</span>}
        </div>
        <CardDescription className="pt-2 text-lg text-foreground">{question.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOriginalIndex?.toString()} // Value is the originalIndex as a string
          onValueChange={(value) => setSelectedOriginalIndex(parseInt(value, 10))}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {shuffledOptions.map((optionItem, displayIndex) => {
            const isSelected = selectedOriginalIndex === optionItem.originalIndex;
            const isActuallyCorrectOption = optionItem.originalIndex === question.correctAnswerIndex;
            
            let optionClass = "border-input hover:border-accent";
            if (isSubmitted) {
              if (isActuallyCorrectOption) {
                optionClass = "border-green-500 bg-green-500/10";
              } else if (isSelected && !isActuallyCorrectOption) {
                optionClass = "border-red-500 bg-red-500/10";
              }
            }

            return (
              <Label
                key={optionItem.originalIndex} // Use originalIndex for a stable key
                htmlFor={`option-${optionItem.originalIndex}`}
                className={cn(
                  "flex items-center space-x-3 rounded-md border p-4 transition-all cursor-pointer",
                  optionClass,
                  isSubmitted && !isActuallyCorrectOption && !isSelected ? "opacity-70" : ""
                )}
              >
                <RadioGroupItem value={optionItem.originalIndex.toString()} id={`option-${optionItem.originalIndex}`} className="shrink-0" />
                <span className="font-medium">{getOptionLabel(displayIndex)}.</span>
                <span>{optionItem.text}</span>
                {isSubmitted && isSelected && isActuallyCorrectOption && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                {isSubmitted && isSelected && !isActuallyCorrectOption && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                {isSubmitted && !isSelected && isActuallyCorrectOption && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
              </Label>
            );
          })}
        </RadioGroup>
        {isSubmitted && question.explanation && (
          <div className={cn(
            "mt-4 p-4 rounded-md text-sm",
            isCorrect ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
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
          // This button is visually hidden but helps maintain layout consistency. 
          // The actual "Next Question" or "View Results" button is rendered by the parent page (StudySessionPage)
          <Button onClick={() => {}} variant="outline" className="opacity-0 pointer-events-none">
             Placeholder Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
