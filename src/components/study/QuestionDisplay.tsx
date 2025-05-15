"use client";

import type { MCQ } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface QuestionDisplayProps {
  question: MCQ;
  onAnswerSubmit: (isCorrect: boolean, selectedOptionIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({ question, onAnswerSubmit, questionNumber, totalQuestions }: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelectedOption(undefined);
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [question]);

  const handleSubmit = () => {
    if (selectedOption === undefined) {
        // Optionally, show a toast or message to select an option
        alert("Please select an option.");
        return;
    }
    const selectedIndex = question.options.indexOf(selectedOption);
    const correct = selectedIndex === question.correctAnswerIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswerSubmit(correct, selectedIndex);
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
          value={selectedOption}
          onValueChange={setSelectedOption}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = index === question.correctAnswerIndex;
            let optionClass = "border-input hover:border-accent";
            if (isSubmitted) {
              if (isCorrectOption) {
                optionClass = "border-green-500 bg-green-500/10";
              } else if (isSelected && !isCorrectOption) {
                optionClass = "border-red-500 bg-red-500/10";
              }
            }

            return (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={cn(
                  "flex items-center space-x-3 rounded-md border p-4 transition-all cursor-pointer",
                  optionClass,
                  isSubmitted && !isCorrectOption && !isSelected ? "opacity-70" : ""
                )}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="shrink-0" />
                <span className="font-medium">{getOptionLabel(index)}.</span>
                <span>{option}</span>
                {isSubmitted && isSelected && isCorrectOption && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                {isSubmitted && isSelected && !isCorrectOption && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                {isSubmitted && !isSelected && isCorrectOption && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
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
          <Button onClick={handleSubmit} disabled={selectedOption === undefined}>Submit Answer</Button>
        ) : (
          <Button onClick={() => {/* This button will be controlled by parent for "Next Question" */}} variant="outline" className="opacity-0 pointer-events-none">
             {/* Parent will render the actual Next button */}
             Placeholder Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
