"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

const formSchema = z.object({
  csvFile: typeof window === 'undefined' 
    ? z.any() 
    : z.instanceof(FileList)
        .refine(files => files.length > 0, 'A CSV file is required.')
        .refine(files => files[0]?.type === 'text/csv' || files[0]?.name.endsWith('.csv'), 'File must be a CSV.'),
});

type McqUploadFormValues = z.infer<typeof formSchema>;

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
    // Mock processing: In a real app, you'd parse the CSV and send it to the backend.
    console.log('Uploaded file:', file.name, file.type, file.size);

    toast({
      title: 'File Upload Successful',
      description: `"${file.name}" has been queued for processing.`,
    });
    form.reset();
     // Reset the file input visually if possible (browser security might prevent direct manipulation)
    const fileInput = document.getElementById('csvFile-input') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.value = '';
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
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
                Ensure one question per line. `correctAnswerIndex` is 0-based. `subject` and `explanation` are optional.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Uploading..." : "Upload File"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
