
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import type { MCQ, McqSet, GamificationStats } from '@/lib/types'; 
import { cn } from '@/lib/utils';
import { checkAndNotifyAchievements } from '@/lib/achievements-helper';

const formSchema = z.object({
  csvFile: typeof window === 'undefined' 
    ? z.any() 
    : z.instanceof(FileList)
        .refine(files => files.length > 0, 'A CSV file is required.')
        .refine(files => files[0]?.type === 'text/csv' || files[0]?.name.endsWith('.csv'), 'File must be a CSV.'),
});

type McqUploadFormValues = z.infer<typeof formSchema>;

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';
const LOCAL_STORAGE_GAMIFICATION_KEY = 'smartStudyProGamificationStats';

export function McqUploadForm() {
  const { toast } = useToast();
  const form = useForm<McqUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      csvFile: undefined,
    },
  });

  function onSubmit(data: McqUploadFormValues) {
    const file = data.csvFile[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText) {
          toast({ title: 'Error reading file', description: 'File content is empty.', variant: 'destructive' });
          return;
        }

        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const parsedMcqs: MCQ[] = [];
        let skippedLines = 0;

        const headerKeywords = ['question', 'option', 'correctanswerindex', 'subject', 'explanation'];
        let startIndex = 0;
        if (lines.length > 0 && headerKeywords.some(kw => lines[0].toLowerCase().includes(kw))) {
          startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = line.split(',').map(v => v.trim());
          
          if (values.length < 6) {
            console.warn(`Skipping malformed line ${i + 1}: Not enough values. Line: "${line}"`);
            skippedLines++;
            continue;
          }

          const [question, opt1, opt2, opt3, opt4, correctIdxStr, subject, explanation] = values;
          const correctAnswerIndex = parseInt(correctIdxStr, 10);

          if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex > 3) {
            console.warn(`Skipping line ${i + 1} due to invalid correctAnswerIndex: "${correctIdxStr}". Line: "${line}"`);
            skippedLines++;
            continue;
          }
          if (!question || !opt1 || !opt2 || !opt3 || !opt4) {
            console.warn(`Skipping line ${i + 1} due to missing question or options. Line: "${line}"`);
            skippedLines++;
            continue;
          }

          const mcqToAdd: MCQ = {
            id: `mcq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${i}`,
            question: question,
            options: [opt1, opt2, opt3, opt4],
            correctAnswerIndex: correctAnswerIndex,
            subject: subject || undefined,
            explanation: explanation || undefined,
            nextReviewSession: 1, 
            intervalIndex: 0,
            lastReviewedSession: undefined,
            timesCorrect: 0,
            timesIncorrect: 0,
          };
          parsedMcqs.push(mcqToAdd);
        }

        let existingMcqSets: McqSet[] = [];
        try {
          const storedSets = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
          if (storedSets) {
            const parsed = JSON.parse(storedSets);
            if (Array.isArray(parsed)) {
              existingMcqSets = parsed;
            } else {
               console.warn("Stored MCQ sets were not an array. Initializing as empty.");
            }
          }
        } catch (e) {
          console.error("Failed to parse existing MCQ sets from localStorage.", e);
        }
        
        const newSetId = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        const newMcqSet: McqSet = {
          id: newSetId,
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          mcqs: parsedMcqs,
          isActive: true,
        };

        const updatedMcqSets = [...existingMcqSets, newMcqSet];
        localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(updatedMcqSets));
        
        const gamificationString = localStorage.getItem(LOCAL_STORAGE_GAMIFICATION_KEY);
        const gamification: GamificationStats | null = gamificationString ? JSON.parse(gamificationString) : null;
        checkAndNotifyAchievements(toast, gamification, updatedMcqSets);

        toast({
          title: 'Upload Successful',
          description: `${parsedMcqs.length} question(s) from "${file.name}" added. ${skippedLines} line(s) skipped.`,
        });

      } catch (error) {
        console.error("Error processing CSV file:", error);
        toast({ title: 'Error Processing File', description: 'An unexpected error occurred. Check console for details.', variant: 'destructive' });
      } finally {
        form.reset();
        const fileInput = document.getElementById('csvFile-input') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }
      }
    };

    reader.onerror = () => {
      toast({ title: 'Error Reading File', description: 'Could not read the selected file.', variant: 'destructive' });
      form.reset();
    };

    reader.readAsText(file);
  }

  return (
    <Card className="w-full max-w-lg shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-accent" />
              Upload MCQs
            </CardTitle>
            <CardDescription>
              Upload a CSV file containing your multiple-choice questions. Please ensure it follows the specified format.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="csvFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="csvFile-input">CSV File</FormLabel>
                  <FormControl>
                     <Input 
                        id="csvFile-input"
                        type="file" 
                        accept=".csv"
                        className="cursor-pointer file:text-accent file:font-semibold hover:file:bg-accent/10"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                  </FormControl>
                  <FormDescription>
                    Format: question,option1,option2,option3,option4,correctAnswerIndex,subject,explanation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div>
              <h4 className="font-medium text-sm mb-1">CSV Format Example:</h4>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                <code>What is 2+2?,3,4,5,6,1,Math,The sum of 2 and 2 is 4.</code><br/>
                <code>Capital of Japan?,Beijing,Seoul,Tokyo,Bangkok,2,Geography,Tokyo is the capital.</code>
              </pre>
              <p className="text-xs text-muted-foreground mt-1">
                Ensure one question per line. `correctAnswerIndex` is 0-based. `subject` and `explanation` are optional and can be empty (e.g., `...,,,explanation text`).
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Processing...' : 'Upload and Add Questions'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
