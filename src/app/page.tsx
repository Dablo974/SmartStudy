import { AppLayout } from '@/components/layout/AppLayout';
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import type { UserProgress } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for demonstration
const mockUserProgress: UserProgress = {
  totalQuestionsStudied: 125,
  correctAnswers: 98,
  incorrectAnswers: 27,
  accuracy: (98 / 125) * 100,
  currentStreak: 5,
  longestStreak: 12,
  lastStudiedDate: new Date().toISOString(),
  topicMastery: {
    'Algebra': 75,
    'Calculus': 60,
    'History': 85,
  },
};

export default function DashboardPage() {
  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        <PerformanceSummary progress={mockUserProgress} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProgressChart />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Start Studying</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 text-center h-full">
              <p className="text-muted-foreground">
                Ready for your next session? Jump in and keep learning!
              </p>
              <Link href="/study" passHref>
                <Button size="lg" className="w-full max-w-xs">
                  Start Study Session
                </Button>
              </Link>
               <p className="text-sm text-muted-foreground pt-4">
                Or, upload more questions to expand your knowledge base.
              </p>
              <Link href="/upload" passHref>
                <Button variant="outline" size="lg" className="w-full max-w-xs">
                  Upload MCQs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
