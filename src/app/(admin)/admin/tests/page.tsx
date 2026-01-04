import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const tests = [
  { id: 'CS101-FINAL', title: 'Intro to CS - Final', candidates: 150, status: 'Active' },
  { id: 'MA203-MIDTERM', title: 'Calculus II - Midterm', candidates: 88, status: 'Active' },
  { id: 'PHY201-QUIZ3', title: 'University Physics I - Quiz 3', candidates: 120, status: 'Finished' },
  { id: 'CHEM101-FINAL', title: 'General Chemistry - Final', candidates: 0, status: 'Draft' },
];

export default function TestsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tests</h1>
        <Button>Create New Test</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Candidates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
                <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.id}</TableCell>
              <TableCell>{test.title}</TableCell>
              <TableCell>{test.candidates}</TableCell>
              <TableCell>
                <Badge variant={test.status === 'Active' ? 'default' : test.status === 'Finished' ? 'secondary' : 'outline'}>
                    {test.status}
                </Badge>
              </TableCell>
               <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Results</DropdownMenuItem>
                     <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
