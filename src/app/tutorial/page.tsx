
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LayoutDashboard, BookOpenText, UploadCloud, ListChecks, FilePlus2, Wand2, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: "Your personal control center. Track your progress, view your mastery by subject, and quickly access your next study session.",
    link: '/'
  },
  {
    icon: BookOpenText,
    title: 'Study Session',
    description: "The heart of the app. Answer the questions due for your session. The spaced repetition system automatically calculates when you should review each question for optimal memorization.",
    link: '/study'
  },
  {
    icon: ClipboardCheck,
    title: 'Exam Mode',
    description: "Test your knowledge under exam conditions. This mode includes all your active questions in a timed or untimed test, without affecting your spaced repetition progress.",
    link: '/exam-mode'
  },
  {
    icon: ListChecks,
    title: 'Manage Questions',
    description: "Activate or deactivate question sets for your study sessions, or delete sets you no longer need.",
    link: '/manage-questions'
  },
  {
    icon: UploadCloud,
    title: 'Upload MCQs',
    description: "Import your own sets of questions in CSV format. Ideal for quickly adding pre-made or shared MCQ sets.",
    link: '/upload'
  },
  {
    icon: FilePlus2,
    title: 'Create MCQs',
    description: "Create your own questions one by one with a simple form. You can then export them to CSV format.",
    link: '/create-mcqs'
  },
  {
    icon: Wand2,
    title: 'Generate with AI',
    description: "Upload your course materials in PDF format and let the AI automatically generate a relevant set of MCQs to save you time.",
    link: '/generate-from-pdf'
  }
];

export default function TutorialPage() {
  return (
    <AppLayout pageTitle="Tutorial">
      <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Logo className="h-8 w-8" />
              Welcome to SmartStudy Pro!
            </CardTitle>
            <CardDescription>
              This guide introduces the key features of the application to help you get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {features.map((feature, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 font-semibold text-lg">
                      <feature.icon className="h-5 w-5" />
                      {feature.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-3">
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      <Link href={feature.link} className="text-sm font-semibold text-accent hover:underline">
                        Go to the {feature.title} page &rarr;
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
