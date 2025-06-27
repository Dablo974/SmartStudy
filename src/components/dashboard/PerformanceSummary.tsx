
import type { UserProgress } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, CalendarClock } from 'lucide-react';

interface PerformanceSummaryProps {
  progress: UserProgress;
}

const StatCard = ({ title, value, icon: Icon, unit, colorClass = "text-primary" }: { title: string, value: string | number, icon: React.ElementType, unit?: string, colorClass?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}{unit && <span className="text-xs text-muted-foreground">{unit}</span>}</div>
    </CardContent>
  </Card>
);

export function PerformanceSummary({ progress }: PerformanceSummaryProps) {
  const totalAnswers = progress.correctAnswers + progress.incorrectAnswers;
  const accuracy = totalAnswers > 0 ? (progress.correctAnswers / totalAnswers) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard title="Total Questions Studied" value={progress.totalQuestionsStudied} icon={BookOpenText} colorClass="text-accent" />
      <StatCard title="Questions Due For Review" value={progress.questionsDue} icon={CalendarClock} colorClass="text-orange-500" />
    </div>
  );
}
