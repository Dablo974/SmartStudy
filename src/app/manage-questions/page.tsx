
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import type { MCQ, McqSet } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, ListChecks, FileQuestion, FileEdit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';

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

export default function ManageQuestionsPage() {
  const [mcqSets, setMcqSets] = useState<McqSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // State for deleting entire sets
  const [isDeleteSetDialogOpen, setIsDeleteSetDialogOpen] = useState(false);
  const [setToDeleteId, setSetToDeleteId] = useState<string | null>(null);

  // State for editing a single MCQ
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMcq, setEditingMcq] = useState<{mcq: MCQ, setId: string} | null>(null);

  // State for deleting a single MCQ
  const [isDeleteMcqDialogOpen, setIsDeleteMcqDialogOpen] = useState(false);
  const [mcqToDelete, setMcqToDelete] = useState<{mcqId: string, setId: string} | null>(null);

  const form = useForm<McqFormValues>({
    resolver: zodResolver(mcqSchema),
  });

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedSetsString = localStorage.getItem(LOCAL_STORAGE_MCQ_SETS_KEY);
      if (storedSetsString) {
        const parsedSets = JSON.parse(storedSetsString) as McqSet[];
        setMcqSets(parsedSets.map(s => ({...s, isActive: s.isActive === undefined ? true : s.isActive })));
      } else {
        setMcqSets([]);
      }
    } catch (e) {
      console.error("Failed to load MCQ sets from localStorage", e);
      toast({ title: "Error Loading Data", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);
  
  useEffect(() => {
    if (editingMcq) {
      form.reset({
        question: editingMcq.mcq.question,
        options: editingMcq.mcq.options,
        correctAnswerIndex: editingMcq.mcq.correctAnswerIndex.toString(),
        subject: editingMcq.mcq.subject || '',
        explanation: editingMcq.mcq.explanation || '',
      });
    }
  }, [editingMcq, form]);

  const handleToggleActive = (setId: string, isActive: boolean) => {
    setMcqSets(prevSets => {
      const updatedSets = prevSets.map(set => set.id === setId ? { ...set, isActive } : set);
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(updatedSets));
      toast({ title: `Set ${isActive ? 'activated' : 'deactivated'}.` });
      return updatedSets;
    });
  };
  
  const handleDeleteSetClick = (setId: string) => {
    setSetToDeleteId(setId);
    setIsDeleteSetDialogOpen(true);
  };

  const confirmDeleteSetAction = () => {
    if (!setToDeleteId) return;
    setMcqSets(prevSets => {
      const updatedSets = prevSets.filter(set => set.id !== setToDeleteId);
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(updatedSets));
      toast({ title: `Set Deleted`, variant: "destructive" });
      return updatedSets;
    });
    setIsDeleteSetDialogOpen(false); 
    setSetToDeleteId(null); 
  };
  
  const handleEditMcqClick = (mcq: MCQ, setId: string) => {
    setEditingMcq({ mcq, setId });
    setIsEditModalOpen(true);
  };
  
  const onUpdateMcqSubmit = (data: McqFormValues) => {
    if (!editingMcq) return;
    setMcqSets(prevSets => {
      const newSets = prevSets.map(set => {
        if (set.id === editingMcq.setId) {
          const newMcqs = set.mcqs.map(mcq => 
            mcq.id === editingMcq.mcq.id 
            ? { ...mcq, ...data, correctAnswerIndex: parseInt(data.correctAnswerIndex, 10) } 
            : mcq
          );
          return { ...set, mcqs: newMcqs };
        }
        return set;
      });
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(newSets));
      return newSets;
    });
    toast({ title: 'Question Updated', description: 'Your changes have been saved.' });
    setIsEditModalOpen(false);
    setEditingMcq(null);
  };

  const handleDeleteMcqClick = (mcqId: string, setId: string) => {
    setMcqToDelete({ mcqId, setId });
    setIsDeleteMcqDialogOpen(true);
  };
  
  const confirmDeleteMcqAction = () => {
    if (!mcqToDelete) return;
    setMcqSets(prevSets => {
      const newSets = prevSets.map(set => {
        if (set.id === mcqToDelete.setId) {
          return { ...set, mcqs: set.mcqs.filter(mcq => mcq.id !== mcqToDelete.mcqId) };
        }
        return set;
      });
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(newSets));
      return newSets;
    });
    toast({ title: 'Question Deleted', variant: 'destructive' });
    setIsDeleteMcqDialogOpen(false);
    setMcqToDelete(null);
  };

  if (isLoading) {
    return <AppLayout pageTitle="Manage Question Sets"><ListChecks className="w-16 h-16 text-accent animate-pulse mx-auto mt-10" /></AppLayout>;
  }

  return (
    <AppLayout pageTitle="Manage Question Sets">
      {mcqSets.length === 0 ? (
        <Card className="mt-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <CardHeader><CardTitle><FileQuestion className="inline-block mr-2"/>No Question Sets</CardTitle></CardHeader>
          <CardContent><p>Upload some questions to get started.</p></CardContent>
          <CardFooter><Button asChild><Link href="/upload">Upload Set</Link></Button></CardFooter>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
          {mcqSets.map((set) => (
            <AccordionItem value={set.id} key={set.id} className="border-b-0">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <CardTitle className="text-xl">{set.fileName}</CardTitle>
                      <CardDescription>Uploaded on: {new Date(set.uploadDate).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Label htmlFor={`active-switch-${set.id}`} className="text-sm font-medium">Active</Label>
                       <Switch id={`active-switch-${set.id}`} checked={set.isActive} onCheckedChange={(c) => handleToggleActive(set.id, c)} />
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteSetClick(set.id)} className="text-destructive h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
                <AccordionTrigger className="px-6 py-2 bg-muted/50 hover:bg-muted rounded-b-lg text-sm font-semibold hover:no-underline">
                  View/Edit Questions ({set.mcqs.length})
                </AccordionTrigger>
                <AccordionContent className="p-4 md:p-6">
                  {set.mcqs.length > 0 ? (
                    <ul className="space-y-3">
                      {set.mcqs.map((mcq, idx) => (
                        <li key={mcq.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded-md bg-muted/50">
                          <p className="text-sm flex-1 pr-4 leading-snug">{idx + 1}. {mcq.question}</p>
                          <div className="flex gap-2 self-end sm:self-center">
                            <Button size="sm" variant="outline" onClick={() => handleEditMcqClick(mcq, set.id)}><FileEdit className="mr-1 h-4 w-4"/> Edit</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteMcqClick(mcq.id, set.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50"><Trash className="mr-1 h-4 w-4"/> Delete</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : ( <p className="text-sm text-muted-foreground text-center py-4">This set has no questions.</p> )}
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Edit MCQ Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader><DialogTitle>Edit Question</DialogTitle><DialogDescription>Make changes to your question below.</DialogDescription></DialogHeader>
          <Form {...form}><form onSubmit={form.handleSubmit(onUpdateMcqSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="question" render={({ field }) => (
                <FormItem><FormLabel>Question Text</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              {[0, 1, 2, 3].map(i => (
                <FormField key={i} control={form.control} name={`options.${i}`} render={({ field }) => (
                  <FormItem><FormLabel>Option {String.fromCharCode(65 + i)}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              ))}
              <FormField control={form.control} name="correctAnswerIndex" render={({ field }) => (
                  <FormItem><FormLabel>Correct Answer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="0">Option A</SelectItem><SelectItem value="1">Option B</SelectItem>
                        <SelectItem value="2">Option C</SelectItem><SelectItem value="3">Option D</SelectItem>
                      </SelectContent>
                    </Select><FormMessage/>
                  </FormItem>
              )}/>
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="explanation" render={({ field }) => (
                <FormItem><FormLabel>Explanation</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>
              )}/>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></div>
          </form></Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete MCQ Alert */}
      <AlertDialog open={isDeleteMcqDialogOpen} onOpenChange={setIsDeleteMcqDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this question?</AlertDialogTitle><AlertDialogDescription>This action is irreversible and will permanently delete the question.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteMcqAction} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Set Alert */}
      <AlertDialog open={isDeleteSetDialogOpen} onOpenChange={setIsDeleteSetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the question set &ldquo;{mcqSets.find(s => s.id === setToDeleteId)?.fileName || ''}&rdquo; and all its questions.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteSetAction} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Continue</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
