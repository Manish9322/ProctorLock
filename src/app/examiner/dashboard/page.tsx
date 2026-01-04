'use client';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const candidates = [
  { id: 'user1', name: 'Alice Johnson', examId: 'CS101-FINAL', status: 'In Progress' },
  { id: 'user2', name: 'Bob Williams', examId: 'MA203-MIDTERM', status: 'Flagged' },
  { id: 'user3', name: 'Charlie Brown', examId: 'PHY201-QUIZ3', status: 'In Progress' },
  { id: 'user4', name: 'Diana Miller', examId: 'CS101-FINAL', status: 'Finished' },
];

export default function ExaminerDashboard() {
  return (
    <DashboardLayout allowedRoles={['examiner']}>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Examiner Dashboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Live Proctoring Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Exam ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.examId}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        candidate.status === 'Flagged'
                          ? 'destructive'
                          : candidate.status === 'Finished'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/examiner/dashboard/${candidate.id}`} passHref>
                        <ArrowRight className="inline-block h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
