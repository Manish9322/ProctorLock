
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
import { Badge } from '@/components/ui/badge';
import { BookOpenCheck, Calendar, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useGetAssignmentsForCandidateQuery } from '@/services/api';
import type { Test } from '@/app/(admin)/admin/tests/page';
import { Skeleton } from '@/components/ui/skeleton';

type ExamStatus = 'Upcoming' | 'Live' | 'Completed' | 'Missed';

interface AssignedExam {
  _id: string;
  test: Test;
  status: string; // This is the assignment status, e.g. "Assigned", "Completed"
}

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft as { days: number, hours: number, minutes: number, seconds: number };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: any[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return;
    }
    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval as keyof typeof timeLeft]}
        {interval[0]}{' '}
      </span>
    );
  });

  return (
     <div className="text-sm font-medium text-center text-primary">
      Starts in: {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};


export default function CandidateDashboard() {
  const { user } = useAuth();
  const { data: assignments = [], isLoading, isError } = useGetAssignmentsForCandidateQuery(user?.id, {
    skip: !user?.id,
  });

  const [isClient, setIsClient] = useState(false);
  const [highlightedExam, setHighlightedExam] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const enrolledTestId = localStorage.getItem('proctorlock_test_enroll');
    if (enrolledTestId) {
        setHighlightedExam(enrolledTestId);
        // Optional: scroll to the highlighted exam
        setTimeout(() => {
            const element = document.getElementById(`exam-${enrolledTestId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            localStorage.removeItem('proctorlock_test_enroll');
        }, 100);
    }
  }, []);
  
  const getExamStatus = (test: Test): ExamStatus => {
    if (!isClient) return 'Upcoming'; // Default status on server
    
    const now = new Date();
    const startTime = new Date(`${test.scheduling.date}T${test.scheduling.startTime}`);
    const endTime = new Date(`${test.scheduling.date}T${test.scheduling.endTime}`);
    
    if (now > endTime) return 'Completed';
    if (now >= startTime && now <= endTime) return 'Live';
    return 'Upcoming';
  };
  
  const examsData = useMemo(() => {
    if (!assignments) return [];
    return assignments
      .filter((assignment: AssignedExam) => assignment.test) // Filter out assignments with no test data
      .map((assignment: AssignedExam) => {
        const status = getExamStatus(assignment.test);
        return {
          ...assignment,
          test: {
            ...assignment.test,
            dynamicStatus: status,
          }
        };
      });
  }, [assignments, isClient]);

  const getStatusBadgeVariant = (status: ExamStatus) => {
    switch (status) {
      case 'Live': return 'default';
      case 'Completed': return 'secondary';
      case 'Missed': return 'destructive';
      case 'Upcoming': return 'outline';
      default: return 'outline';
    }
  }

  const isExamNear = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diff = +date - +now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000; // Less than 24 hours away
  }

  return (
    <DashboardLayout allowedRoles={['candidate']}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Exams</h1>
        <p className="text-muted-foreground">
            Here are your scheduled, live, and completed exams.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
             <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : isError ? (
           <div className="lg:col-span-3">
              <Card className="items-center text-center p-8">
                 <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                 <h3 className="font-semibold">Failed to load exams</h3>
                 <p className="text-muted-foreground text-sm">There was an error fetching your assignments. Please try again later.</p>
              </Card>
           </div>
        ) : examsData.length === 0 ? (
          <div className="lg:col-span-3">
            <Card className="items-center text-center p-8">
                <BookOpenCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold">No Exams Assigned</h3>
                <p className="text-muted-foreground text-sm">You have not been assigned to any exams yet. Please check back later.</p>
            </Card>
          </div>
        ) : (
          examsData.map(({ _id, test }: { _id: string, test: Test & { dynamicStatus: ExamStatus } }) => {
            const scheduledDateTime = isClient ? new Date(`${test.scheduling.date}T${test.scheduling.startTime}`) : new Date();

            return (
              <Card
                key={_id}
                id={`exam-${_id}`}
                className={cn(
                    "flex flex-col transition-all",
                    highlightedExam === _id && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium leading-tight">
                      {test.title}
                    </CardTitle>
                    <Badge variant={getStatusBadgeVariant(test.dynamicStatus)}>{test.dynamicStatus}</Badge>
                  </div>
                  <CardDescription>ID: {test._id}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{isClient && scheduledDateTime.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Duration: {test.scheduling.duration} minutes</span>
                  </div>
                  {test.dynamicStatus === 'Upcoming' && isClient && isExamNear(test.scheduling.date, test.scheduling.startTime) && (
                    <div className="pt-2">
                        <CountdownTimer targetDate={scheduledDateTime} />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" disabled={test.dynamicStatus !== 'Live' && test.dynamicStatus !== 'Upcoming'}>
                    <Link href={`/exam/${test._id}/pre-check`}>
                      {test.dynamicStatus === 'Live' ? 'Join Now' : 'Proceed to Exam'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
