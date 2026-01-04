'use client';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

const exams = [
  { id: 'CS101-FINAL', title: 'Introduction to Computer Science - Final Exam' },
  { id: 'MA203-MIDTERM', title: 'Calculus II - Midterm' },
  { id: 'PHY201-QUIZ3', title: 'University Physics I - Quiz 3' },
];

export default function CandidateDashboard() {
  return (
    <DashboardLayout allowedRoles={['candidate']}>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Exams</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <BookOpenCheck className="h-8 w-8 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">
                {exam.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>ID: {exam.id}</CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={`/candidate/exam/${exam.id}/pre-check`} passHref>
                <Button>Proceed to Exam</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
