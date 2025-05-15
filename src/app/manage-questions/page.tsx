
"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import type { McqSet } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, ListChecks, FileQuestion } from 'lucide-react';
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
  // AlertDialogTrigger, // No longer needed for this approach
} from "@/components/ui/alert-dialog";

const LOCAL_STORAGE_MCQ_SETS_KEY = 'smartStudyProUserMcqSets';

export default function ManageQuestionsPage() {
  const [mcqSets, setMcqSets] = useState<McqSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [setToDeleteId, setSetToDeleteId] = useState<string | null>(null);

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
      setMcqSets([]);
      toast({
        title: "Error Loading Data",
        description: "Could not load question sets from local storage.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const handleToggleActive = (setId: string, isActive: boolean) => {
    setMcqSets(prevSets => {
      const updatedSets = prevSets.map(set =>
        set.id === setId ? { ...set, isActive } : set
      );
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(updatedSets));
      toast({
        title: `Set "${updatedSets.find(s=>s.id === setId)?.fileName}" ${isActive ? 'activated' : 'deactivated'}.`,
        description: `Questions from this set will ${isActive ? '' : 'not '}be included in study sessions.`,
      });
      return updatedSets;
    });
  };
  
  const handleDeleteSetClick = (setId: string) => {
    setSetToDeleteId(setId);
    setIsDeleteDialogOpen(true); // Directly open the dialog
  };

  const confirmDeleteAction = () => {
    if (!setToDeleteId) return;

    setMcqSets(prevSets => {
      const setToDelete = prevSets.find(s => s.id === setToDeleteId);
      const updatedSets = prevSets.filter(set => set.id !== setToDeleteId);
      localStorage.setItem(LOCAL_STORAGE_MCQ_SETS_KEY, JSON.stringify(updatedSets));
      toast({
        title: `Set "${setToDelete?.fileName}" Deleted`,
        description: `The question set has been removed.`,
      });
      return updatedSets;
    });
    setIsDeleteDialogOpen(false); // Close the dialog
    setSetToDeleteId(null); // Reset the ID
  };

  if (isLoading) {
    return (
      <AppLayout pageTitle="Manage Question Sets">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ListChecks className="w-16 h-16 text-accent mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading Question Sets...</h2>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Manage Question Sets">
      {mcqSets.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-6 h-6 text-muted-foreground" />
              No Question Sets Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven't uploaded any MCQ sets yet. 
            </p>
          </CardContent>
           <CardFooter>
             <Link href="/upload" passHref>
              <Button>Upload Your First Set</Button>
            </Link>
           </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          {mcqSets.map(set => (
            <Card key={set.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{set.fileName}</CardTitle>
                    <CardDescription>
                      Uploaded on: {new Date(set.uploadDate).toLocaleDateString()} | {set.mcqs.length} question(s)
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteSetClick(set.id)} 
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Delete set</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`active-switch-${set.id}`}
                    checked={set.isActive}
                    onCheckedChange={(checked) => handleToggleActive(set.id, checked)}
                  />
                  <Label htmlFor={`active-switch-${set.id}`} className="text-sm font-medium">
                    {set.isActive ? 'Active in Study Sessions' : 'Inactive in Study Sessions'}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              question set &ldquo;{mcqSets.find(s => s.id === setToDeleteId)?.fileName || ''}&rdquo; and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsDeleteDialogOpen(false); setSetToDeleteId(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
