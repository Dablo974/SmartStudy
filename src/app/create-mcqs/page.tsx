
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { MCQ } from '@/lib/types';
import { FilePlus2, Trash2, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const mcqSchema = z.object({
  question: z.string().min(1, "Question text is required."),
  options: z.array(z.string().min(1, "Option text cannot be empty.")).length(4, "Exactly 4 options are required."),
  correctAnswerIndex: z.string().refine(val => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 0 && num <= 3;
  }, "Correct answer must be between 0 and 3."),
  subject: z.string().optional(),
  explanation: z.string().optional(),
});

type McqFormValues = z.infer<typeof mcqSchema>;

export default function CreateMcqsPage() {
  const { toast } = useToast();
  const [createdMcqs, setCreatedMcqs] = useState<MCQ[]>([]);

  const form = useForm<McqFormValues>({
    resolver: zodResolver(mcqSchema),
    defaultValues: {
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: '0',
      subject: '',
      explanation: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options" as never, // This is a workaround for typing issue with fixed length arrays
  });


  const handleAddMcq = (data: McqFormValues) => {
    const newMcq: MCQ = {
      id: `new-mcq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      question: data.question,
      options: data.options,
      correctAnswerIndex: parseInt(data.correctAnswerIndex, 10),
      subject: data.subject || undefined,
      explanation: data.explanation || undefined,
      // Default spaced repetition values, similar to how they are initialized on upload
      nextReviewSession: 1,
      intervalIndex: 0,
      lastReviewedSession: undefined,
      timesCorrect: 0,
      timesIncorrect: 0,
    };
    setCreatedMcqs(prevMcqs => [...prevMcqs, newMcq]);
    form.reset(); // Reset form for next entry
    toast({
      title: "MCQ Added",
      description: "The MCQ has been added to the current set.",
    });
  };

  const handleRemoveMcq = (id: string) => {
    setCreatedMcqs(prevMcqs => prevMcqs.filter(mcq => mcq.id !== id));
    toast({
      title: "MCQ Removed",
      description: "The MCQ has been removed from the current set.",
      variant: "destructive"
    });
  };

  const handleClearSet = () => {
    setCreatedMcqs([]);
    form.reset();
    toast({
      title: "Set Cleared",
      description: "All MCQs in the current creation set have been removed.",
    });
  };
  
  const convertToCSV = (mcqs: MCQ[]): string => {
    const header = "question,option1,option2,option3,option4,correctAnswerIndex,subject,explanation\n";
    const rows = mcqs.map(mcq => {
      const options = mcq.options.map(opt => `"${opt.replace(/"/g, '""')}"`).join(','); // Quote options and escape internal quotes
      const question = `"${mcq.question.replace(/"/g, '""')}"`;
      const subject = mcq.subject ? `"${mcq.subject.replace(/"/g, '""')}"` : '';
      const explanation = mcq.explanation ? `"${mcq.explanation.replace(/"/g, '""')}"` : '';
      return `${question},${options},${mcq.correctAnswerIndex},${subject},${explanation}`;
    });
    return header + rows.join('\n');
  };

  const handleExportToCSV = () => {
    if (createdMcqs.length === 0) {
      toast({
        title: "Cannot Export Empty Set",
        description: "Please add at least one MCQ before exporting.",
        variant: "destructive",
      });
      return;
    }
    const csvString = convertToCSV(createdMcqs);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `smartstudy_mcqs_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: `Set of ${createdMcqs.length} MCQ(s) downloaded as CSV.`,
    });
  };

  return (
    <AppLayout pageTitle="Create MCQs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePlus2 className="h-6 w-6 text-accent" />
              Add New MCQ
            </CardTitle>
            <CardDescription>Fill in the details for your multiple-choice question.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddMcq)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the question..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {[0, 1, 2, 3].map((index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`options.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option {String.fromCharCode(65 + index)}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter option ${String.fromCharCode(65 + index)}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="correctAnswerIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the correct option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Option A</SelectItem>
                          <SelectItem value="1">Option B</SelectItem>
                          <SelectItem value="2">Option C</SelectItem>
                          <SelectItem value="3">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mathematics, History" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain why the answer is correct..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Add MCQ to Set</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Current MCQ Set ({createdMcqs.length})</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleClearSet} disabled={createdMcqs.length === 0}>
                  <RotateCcw className="mr-1 h-4 w-4" /> Clear Set
                </Button>
                <Button size="sm" onClick={handleExportToCSV} disabled={createdMcqs.length === 0}>
                  <Download className="mr-1 h-4 w-4" /> Export as CSV
                </Button>
              </div>
            </div>
            <CardDescription>
              {createdMcqs.length > 0 ? "Review your MCQs below before exporting." : "Add MCQs using the form. They will appear here."}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
            {createdMcqs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No MCQs added to the current set yet.</p>
            )}
            {createdMcqs.map((mcq, index) => (
              <Card key={mcq.id} className="bg-muted/50 p-3 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{animationDelay: `${index * 50}ms`}}>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold leading-tight">
                    {index + 1}. {mcq.question}
                    {mcq.subject && <span className="ml-2 text-xs font-normal text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">{mcq.subject}</span>}
                  </p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveMcq(mcq.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="list-none pl-4 mt-1 space-y-0.5">
                  {mcq.options.map((opt, i) => (
                    <li key={i} className={cn("text-xs", i === mcq.correctAnswerIndex ? "text-green-600 font-medium" : "text-muted-foreground")}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </li>
                  ))}
                </ul>
                {mcq.explanation && <p className="text-xs text-muted-foreground mt-1 pt-1 border-t border-border">Expl: {mcq.explanation}</p>}
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
