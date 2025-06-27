
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { MCQ, McqSet } from '@/lib/types';
import type { GeneratedMcq } from '@/ai/flows/generate-mcqs-from-text-flow';
import { generateMcqsFromText } from '@/ai/flows/generate-mcqs-from-text-flow';
import { Loader2, Wand2, Trash2, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  pdfFile: typeof window === 'undefined'
    ? z.any()
    : z.instanceof(FileList)
        .refine(files => files.length > 0, 'A PDF file is required.')
        .refine(files => files[0]?.type === 'application/pdf', 'File must be a PDF.'),
});

type PdfUploadFormValues = z.infer<typeof formSchema>;

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';

export default function GenerateFromPdfPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isParsing, setIsParsing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMcqs, setGeneratedMcqs] = useState<GeneratedMcq[]>([]);
  const [fileName, setFileName] = useState('');

  const form = useForm<PdfUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdfFile: undefined,
    },
  });

  const handlePdfUpload = async (data: PdfUploadFormValues) => {
    const file = data.pdfFile[0];
    if (!file) return;

    setGeneratedMcqs([]);
    setFileName(file.name);
    setIsParsing(true);
    setIsGenerating(false);

    try {
      // Dynamically import pdf-parse to ensure it's only loaded on the client
      const pdf = (await import('pdf-parse')).default;

      // For browser usage, we need to specify the worker source for pdf.js
      // @ts-ignore
      pdf.PDFJS.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.PDFJS.version}/pdf.worker.min.js`;
      
      const buffer = await file.arrayBuffer();
      const pdfData = await pdf(buffer);
      const courseText = pdfData.text;

      if (!courseText.trim()) {
        toast({ title: 'PDF Content Empty', description: 'Could not extract any text from the PDF.', variant: 'destructive' });
        setIsParsing(false);
        return;
      }
      
      setIsParsing(false);
      setIsGenerating(true);

      const result = await generateMcqsFromText(courseText);
      setGeneratedMcqs(result.mcqs);
      
      toast({
        title: 'Generation Complete',
        description: `Successfully generated ${result.mcqs.length} questions from ${file.name}.`,
      });

    } catch (error: any) {
      console.error("Error during PDF parsing or AI generation:", error);
      toast({ title: 'An Error Occurred', description: error.message || 'Failed to process the PDF and generate questions.', variant: 'destructive' });
    } finally {
      setIsParsing(false);
      setIsGenerating(false);
    }
  };
  
  const handleSaveSet = () => {
    if (generatedMcqs.length === 0) {
      toast({ title: "Cannot Save Empty Set", description: "No questions were generated.", variant: 'destructive' });
      return;
    }
    
    const newMcqs: MCQ[] = generatedMcqs.map((genMcq, index) => ({
      ...genMcq,
      id: `ai-mcq-${Date.now()}-${index}`,
      nextReviewSession: 1,
      intervalIndex: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
    }));
    
    const newMcqSet: McqSet = {
      id: `ai-set-${Date.now()}`,
      fileName: `AI-Generated - ${fileName}`,
      uploadDate: new Date().toISOString(),
      mcqs: newMcqs,
      isActive: true,
    };
    
    const existingSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
    const existingSets: McqSet[] = existingSetsString ? JSON.parse(existingSetsString) : [];
    
    const updatedSets = [...existingSets, newMcqSet];
    localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(updatedSets));
    
    toast({
      title: "Set Saved!",
      description: `Your new set with ${newMcqs.length} questions has been saved to your library.`
    });
    
    router.push('/manage-questions');
  };

  const handleClear = () => {
    setGeneratedMcqs([]);
    setFileName('');
    form.reset();
  };

  const isLoading = isParsing || isGenerating;

  return (
    <AppLayout pageTitle="Generate MCQs with AI">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-accent" />
              Generate from PDF
            </CardTitle>
            <CardDescription>Upload your course material as a PDF, and let AI create the questions for you.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePdfUpload)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="pdfFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="application/pdf"
                          disabled={isLoading}
                          className="cursor-pointer file:text-accent file:font-semibold hover:file:bg-accent/10"
                          ref={field.ref}
                          onBlur={field.onBlur}
                          name={field.name}
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isParsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isParsing ? 'Parsing PDF...' : (isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Questions')}
                  {isGenerating && 'Generating with AI...'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out delay-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Generated Questions ({generatedMcqs.length})</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleClear} disabled={isLoading || generatedMcqs.length === 0}>
                  <RotateCcw className="mr-1 h-4 w-4" /> Clear
                </Button>
                <Button size="sm" onClick={handleSaveSet} disabled={isLoading || generatedMcqs.length === 0}>
                  <Download className="mr-1 h-4 w-4" /> Save Set
                </Button>
              </div>
            </div>
            <CardDescription>
              {isLoading ? 'Generation in progress...' : (generatedMcqs.length > 0 ? `Review the questions generated from ${fileName}.` : "Upload a PDF to begin.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="font-semibold">{isParsing ? 'Parsing PDF...' : 'Generating Questions...'}</p>
                <p className="text-sm">This may take a moment.</p>
              </div>
            )}
            {!isLoading && generatedMcqs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Generated questions will appear here.</p>
            )}
            {generatedMcqs.map((mcq, index) => (
              <Card key={index} className="bg-muted/50 p-3 animate-in fade-in">
                <p className="text-sm font-semibold leading-tight">
                  {index + 1}. {mcq.question}
                  {mcq.subject && <span className="ml-2 text-xs font-normal text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">{mcq.subject}</span>}
                </p>
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
