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
    UserPlus,
    Upload,
    Trash,
} from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { useGetCandidatesQuery, useGetAssignmentsForTestQuery, useAssignCandidateMutation, useUnassignCandidateMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Assignment } from '@/models/assignment.model';
import { Skeleton } from '@/components/ui/skeleton';

export default function AssignmentsPage({ params }: { params: { testId: string } }) {
    const { testId } = params;
    const { toast } = useToast();

    // RTK Query Hooks
    const { data: candidatesData = [], isLoading: isLoadingCandidates } = useGetCandidatesQuery({});
    const { data: assignments = [], isLoading: isLoadingAssignments, refetch } = useGetAssignmentsForTestQuery(testId);
    const [assignCandidate, { isLoading: isAssigning }] = useAssignCandidateMutation();
    const [unassignCandidate, { isLoading: isUnassigning }] = useUnassignCandidateMutation();

    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [candidateToRemove, setCandidateToRemove] = useState<Assignment | null>(null);

    const handleAssignCandidate = async () => {
        if (!selectedCandidate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a candidate to assign.' });
            return;
        }

        try {
            await assignCandidate({ testId, candidateId: selectedCandidate }).unwrap();
            toast({ title: 'Success', description: 'Candidate assigned successfully.' });
            setSelectedCandidate('');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Assignment Failed', description: err.data?.message || 'Could not assign candidate.' });
        }
    };

    const handleRemoveAssignment = async () => {
        if (candidateToRemove) {
            try {
                await unassignCandidate(candidateToRemove._id).unwrap();
                toast({ title: 'Success', description: 'Assignment removed.' });
                setCandidateToRemove(null);
            } catch (err: any) {
                toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Could not remove assignment.' });
            }
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'secondary';
            case 'Flagged': return 'destructive';
            default: return 'default';
        }
    }

    const candidateOptions = React.useMemo(() => {
        // Filter out candidates who are already assigned to this test
        const assignedIds = new Set(assignments.map(a => a.candidate._id));
        return candidatesData
            .filter(c => !assignedIds.has(c._id))
            .map(c => ({ value: c._id, label: `${c.name} (${c.email})` }));
    }, [candidatesData, assignments]);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Candidate Assignments</h1>
                <p className="text-muted-foreground">
                    Assign candidates to the test: <strong>{testId}</strong>
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
                                options={candidateOptions}
                                value={selectedCandidate}
                                onChange={setSelectedCandidate}
                                placeholder={isLoadingCandidates ? "Loading candidates..." : "Search by name, email..."}
                                searchPlaceholder="Search candidates..."
                                notFoundMessage="No candidate found."
                            />
                            <Button onClick={handleAssignCandidate} disabled={!selectedCandidate || isAssigning}>
                                {isAssigning ? 'Assigning...' : <><UserPlus className="mr-2 h-4 w-4" /> Assign</>}
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
                            CSV must contain 'email' column. <a href="#" className="underline">Download template</a>.
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
                            {isLoadingAssignments ? (
                                 Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                    </TableRow>
                                ))
                            ) : assignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No candidates assigned yet.</TableCell>
                                </TableRow>
                            ) : (
                                assignments.map((assignment) => (
                                    <TableRow key={assignment._id}>
                                        <TableCell className="font-medium">{assignment.candidate.name}</TableCell>
                                        <TableCell>{assignment.candidate.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setCandidateToRemove(assignment)}>
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
                                This will un-assign <strong>{candidateToRemove.candidate.name}</strong> from this test. They will no longer be able to take it.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCandidateToRemove(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveAssignment} disabled={isUnassigning}>
                                {isUnassigning ? 'Removing...' : 'Remove Assignment'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

    