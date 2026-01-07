
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
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type ExamStatus = 'Upcoming' | 'Live' | 'Completed' | 'Missed';

const examsData = [
  {
    _id: '66a4f971e4f3a7a9a1e0b234', // Example MongoDB ObjectId
    id: 'CS101-FINAL',
    title: 'Introduction to Computer Science - Final Exam',
    status: 'Upcoming' as ExamStatus,
    scheduledDateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: '60 minutes',
  },
  {
    _id: '66a4f971e4f3a7a9a1e0b235',
    id: 'MA203-MIDTERM',
    title: 'Calculus II - Midterm',
    status: 'Live' as ExamStatus,
    scheduledDateTime: new Date(),
    duration: '90 minutes',
  },
  {
    _id: '66a4f971e4f3a7a9a1e0b236',
    id: 'PHY201-QUIZ3',
    title: 'University Physics I - Quiz 3',
    status: 'Completed' as ExamStatus,
    scheduledDateTime: new Date('2024-07-20T10:00:00'),
    duration: '30 minutes',
  },
  {
    _id: '66a4f971e4f3a7a9a1e0b237',
    id: 'CHEM101-LAB',
    title: 'Chemistry Lab Practical',
    status: 'Missed' as ExamStatus,
    scheduledDateTime: new Date('2024-07-19T14:00:00'),
    duration: '45 minutes',
  },
];

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
  const [isClient, setIsClient] = useState(false);
  const [highlightedExam, setHighlightedExam] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const enrolledTestId = localStorage.getItem('proctorlock_test_enroll');
    if (enrolledTestId) {
        setHighlightedExam(enrolledTestId);
        // Optional: scroll to the highlighted exam
        const element = document.getElementById(`exam-${enrolledTestId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        localStorage.removeItem('proctorlock_test_enroll');
    }
  }, []);

  const getStatusBadgeVariant = (status: ExamStatus) => {
    switch (status) {
      case 'Live': return 'default';
      case 'Completed': return 'secondary';
      case 'Missed': return 'destructive';
      case 'Upcoming': return 'outline';
      default: return 'outline';
    }
  }

  const isExamNear = (date: Date) => {
    const now = new Date();
    const diff = +date - +now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000; // Less than 24 hours away
  }

  return (
    <DashboardLayout allowedRoles={['student', 'professional']}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Exams</h1>
        <p className="text-muted-foreground">
            Here are your scheduled, live, and completed exams.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {examsData.map((exam) => (
          <Card
            key={exam._id}
            id={`exam-${exam._id}`}
            className={cn(
                "flex flex-col transition-all",
                highlightedExam === exam._id && "ring-2 ring-primary ring-offset-2"
            )}
           >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {exam.title}
                </CardTitle>
                 <Badge variant={getStatusBadgeVariant(exam.status)}>{exam.status}</Badge>
              </div>
              <CardDescription>ID: {exam.id}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{isClient && exam.scheduledDateTime.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>Duration: {exam.duration}</span>
              </div>
               {exam.status === 'Upcoming' && isClient && isExamNear(exam.scheduledDateTime) && (
                <div className="pt-2">
                    <CountdownTimer targetDate={exam.scheduledDateTime} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" disabled={exam.status !== 'Live' && exam.status !== 'Upcoming'}>
                <Link href={`/exam/${exam.id}/pre-check`}>
                   {exam.status === 'Live' ? 'Join Now' : 'Proceed to Exam'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
