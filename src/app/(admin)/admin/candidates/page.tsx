import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const candidates = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    examId: 'CS101-FINAL',
    status: 'Finished',
  },
  {
    id: 'user2',
    name: 'Bob Williams',
    examId: 'MA203-MIDTERM',
    status: 'Flagged',
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    examId: 'PHY201-QUIZ3',
    status: 'In Progress',
  },
  {
    id: 'user4',
    name: 'Diana Miller',
    examId: 'CS101-FINAL',
    status: 'Finished',
  },
   {
    id: 'user5',
    name: 'Eve Davis',
    examId: 'BIO-101',
    status: 'Not Started',
  },
];

export default function CandidatesPage() {
  return (
    <div className="space-y-4">
       <h1 className="text-2xl font-bold">Candidates</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Current Exam</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.examId}</TableCell>
              <TableCell>
                 <Badge
                      variant={
                        candidate.status === 'Flagged'
                          ? 'destructive'
                          : candidate.status === 'Finished'
                          ? 'secondary'
                          : candidate.status === "In Progress"
                          ? "default"
                          : 'outline'
                      }
                    >
                      {candidate.status}
                    </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
