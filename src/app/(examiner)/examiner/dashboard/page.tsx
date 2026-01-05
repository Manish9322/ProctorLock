'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  BookOpenCheck,
  Clock,
  Video,
  ArrowRight,
  AlertTriangle,
  Keyboard,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';

const liveSessions = [
  { id: 'user1', name: 'Alice Johnson', examId: 'CS101-FINAL', status: 'In Progress' },
  { id: 'user2', name: 'Bob Williams', examId: 'MA203-MIDTERM', status: 'Flagged' },
  { id: 'user3', name: 'Charlie Brown', examId: 'PHY201-QUIZ3', status: 'In Progress' },
];

const recentAlerts = [
    { id: 'alert1', candidate: 'Bob Williams', event: 'Exited fullscreen', timestamp: '2m ago' },
    { id: 'alert2', candidate: 'Alice Johnson', event: 'Tab hidden', timestamp: '5m ago' },
    { id: 'alert3', candidate: 'Charlie Brown', event: 'Pasted content', timestamp: '8m ago' },
]

export default function ExaminerDashboardPage() {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Examiner!</p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Exam
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">+3 since last month</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Sessions</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Happening right now</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">Across all exams</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">5</div>
                 <p className="text-xs text-muted-foreground">In the next 7 days</p>
            </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                        <CardTitle>Live Proctoring Sessions</CardTitle>
                        <CardDescription>Candidates currently taking an exam.</CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/examiner/sessions">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Exam ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Monitor</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {liveSessions.map((candidate) => (
                            <TableRow key={candidate.id}>
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell>{candidate.examId}</TableCell>
                            <TableCell>
                                <Badge
                                variant={
                                    candidate.status === 'Flagged'
                                    ? 'destructive'
                                    : 'default'
                                }
                                >
                                {candidate.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/examiner/monitoring/${candidate.id}`} passHref>
                                    <Button variant="ghost" size="icon">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                        <CardDescription>Potentially suspicious activities.</CardDescription>
                    </CardHeader>
                     <CardContent>
                         <ul className="space-y-4">
                            {recentAlerts.map((log) => (
                                <li key={log.id} className="flex items-start gap-3 text-sm">
                                    <div className="flex-shrink-0">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            {log.event.includes('fullscreen') ? <AlertTriangle className="h-4 w-4 text-muted-foreground"/> : <Keyboard className="h-4 w-4 text-muted-foreground"/>}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{log.event}</p>
                                        <p className="text-muted-foreground">{log.candidate} &middot; {log.timestamp}</p>
                                    </div>
                                </li>
                            ))}
                         </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
