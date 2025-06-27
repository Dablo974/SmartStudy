
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LayoutDashboard, BookOpenText, UploadCloud, ListChecks, FilePlus2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: "Votre tableau de bord personnel. Suivez vos progrès, visualisez votre maîtrise par matière et accédez rapidement à votre prochaine session d'étude.",
    link: '/'
  },
  {
    icon: BookOpenText,
    title: 'Session d\'étude',
    description: "Le cœur de l'application. Répondez aux questions dues pour votre session. Le système de répétition espacée calcule automatiquement quand vous devriez revoir chaque question pour une mémorisation optimale.",
    link: '/study'
  },
  {
    icon: UploadCloud,
    title: 'Téléverser des QCM',
    description: "Importez vos propres lots de questions au format CSV. Idéal pour ajouter rapidement des QCM préparés à l'avance ou partagés par d'autres.",
    link: '/upload'
  },
  {
    icon: ListChecks,
    title: 'Gérer les questions',
    description: "Activez ou désactivez les lots de questions pour vos sessions d'étude, ou supprimez les lots dont vous n'avez plus besoin.",
    link: '/manage-questions'
  },
  {
    icon: FilePlus2,
    title: 'Créer des QCM',
    description: "Créez vos propres questions une par une grâce à un formulaire simple. Vous pouvez ensuite les exporter au format CSV.",
    link: '/create-mcqs'
  },
  {
    icon: Wand2,
    title: 'Générer avec l\'IA',
    description: "Téléversez vos supports de cours au format PDF et laissez l'IA générer automatiquement un lot de QCM pertinents pour vous faire gagner du temps.",
    link: '/generate-from-pdf'
  }
];

export default function TutorialPage() {
  return (
    <AppLayout pageTitle="Tutoriel">
      <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Logo className="h-8 w-8" />
              Bienvenue sur SmartStudy Pro !
            </CardTitle>
            <CardDescription>
              Ce guide vous présente les fonctionnalités clés de l'application pour vous aider à démarrer.
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
                        Aller à la page {feature.title} &rarr;
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
