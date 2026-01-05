'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    ArrowUpDown,
    UserPlus,
    Search,
    Upload,
    Trash,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AssignmentStatus = 'Assigned' | 'Pending' | 'Completed' | 'Flagged';

type AssignedCandidate = {
  id: string;
  name: string;
  email: string;
  testId: string;
  status: AssignmentStatus;
};

const allCandidates = [
    { value: 'user1', label: 'Alice Johnson (alice.j@example.com)' },
    { value: 'user2', label: 'Bob Williams (bob.w@example.com)' },
    { value: 'user3', label: 'Charlie Brown (charlie.b@example.com)' },
    { value: 'user4', label: 'Diana Miller (diana.m@example.com)' },
    { value: 'user5', label: 'Eve Davis (eve.d@example.com)' },
];

const assignedCandidatesData: AssignedCandidate[] = [
  { id: 'user1', name: 'Alice Johnson', email: 'alice.j@example.com', testId: 'CS101-FINAL', status: 'Assigned' },
  { id: 'user2', name: 'Bob Williams', email: 'bob.w@example.com', testId: 'CS101-FINAL', status: 'Completed' },
];

export default function AssignmentsPage() {
    const [assignedCandidates, setAssignedCandidates] = useState(assignedCandidatesData);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [candidateToRemove, setCandidateToRemove] = useState<AssignedCandidate | null>(null);

    const handleAssignCandidate = () => {
        const candidate = allCandidates.find(c => c.value === selectedCandidate);
        if (candidate && !assignedCandidates.some(ac => ac.id === candidate.value)) {
            const [name, email] = candidate.label.split(' (');
            const newAssignment: AssignedCandidate = {
                id: candidate.value,
                name: name,
                email: email.slice(0, -1),
                testId: 'CS101-FINAL', // This would be dynamic
                status: 'Assigned'
            };
            setAssignedCandidates([...assignedCandidates, newAssignment]);
            setSelectedCandidate('');
        }
    };

    const handleRemoveAssignment = () => {
        if (candidateToRemove) {
            setAssignedCandidates(assignedCandidates.filter(c => c.id !== candidateToRemove.id));
            setCandidateToRemove(null);
        }
    };

    const getStatusVariant = (status: AssignmentStatus) => {
        switch (status) {
            case 'Completed': return 'secondary';
            case 'Flagged': return 'destructive';
            default: return 'default';
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Candidate Assignments</h1>
                <p className="text-muted-foreground">
                    Assign candidates to the test: <strong>Intro to CS - Final (CS101-FINAL)</strong>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assign New Candidates</CardTitle>
                    <CardDescription>Select candidates individually, or upload a CSV for bulk assignment.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Assign Individually</Label>
                        <div className="flex gap-2">
                             <Combobox
                                options={allCandidates}
                                value={selectedCandidate}
                                onChange={setSelectedCandidate}
                                placeholder="Search by name, email, or ID..."
                                searchPlaceholder="Search candidates..."
                                notFoundMessage="No candidate found."
                            />
                            <Button onClick={handleAssignCandidate} disabled={!selectedCandidate}>
                                <UserPlus className="mr-2 h-4 w-4" /> Assign
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Bulk Assign</Label>
                        <div className="flex gap-2">
                            <Input type="file" className="flex-grow" accept=".csv"/>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" /> Upload CSV
                            </Button>
                        </div>
                         <p className="text-xs text-muted-foreground">
                            CSV must contain 'email' and 'name' columns. <a href="#" className="underline">Download template</a>.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Assigned Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedCandidates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No candidates assigned yet.</TableCell>
                                </TableRow>
                            ) : (
                                assignedCandidates.map((candidate) => (
                                    <TableRow key={candidate.id}>
                                        <TableCell className="font-medium">{candidate.name}</TableCell>
                                        <TableCell>{candidate.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setCandidateToRemove(candidate)}>
                                                <Trash className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">Remove</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {candidateToRemove && (
                <AlertDialog open={!!candidateToRemove} onOpenChange={(open) => !open && setCandidateToRemove(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will un-assign <strong>{candidateToRemove.name}</strong> from this test. They will no longer be able to take it.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCandidateToRemove(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveAssignment}>Remove Assignment</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
