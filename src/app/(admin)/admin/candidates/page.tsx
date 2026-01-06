'use client';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Search,
    Users,
    CheckCircle,
    AlertTriangle,
    Clock,
    User,
    Building,
    FileText,
    Phone,
    GraduationCap,
    Award,
    Mail,
    Globe,
    CreditCard,
    Trash,
    ThumbsUp,
    ThumbsDown,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetCandidatesQuery, useUpdateCandidateMutation, useDeleteCandidateMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Candidate } from '@/models/candidate.model.js';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';


const CandidateModal = ({
    modalState,
    onOpenChange,
}: {
    modalState: { type: 'view' | 'result' | null; candidate: Candidate | null };
    onOpenChange: (open: boolean) => void;
}) => {
    const { type, candidate } = modalState;
    if (!candidate) return null;

    const getScoreColor = (score: number) => {
        if (score < 60) return "text-destructive";
        if (score < 80) return "text-amber-500";
        return "text-green-500";
    };

    return (
        <Dialog open={!!type} onOpenChange={onOpenChange}>
            <DialogContent className={type === 'view' ? "sm:max-w-xl" : "sm:max-w-md"}>
                {type === 'view' && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Candidate Details</DialogTitle>
                            <DialogDescription>Full information for {candidate.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Full Name</p>
                                        <p className="font-medium">{candidate.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Role</p>
                                        <p className="font-medium">{candidate.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Email</p>
                                        <p className="font-medium">{candidate.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Phone</p>
                                        <p className="font-medium">{candidate.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Organization / Institute</p>
                                        <p className="font-medium">{candidate.college}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Timezone</p>
                                        <p className="font-medium">{candidate.timezone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-2">Verification &amp; Exam Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">{candidate.govIdType}</p>
                                            <p className="font-medium">{candidate.govIdNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Exam ID</p>
                                            <p className="font-medium">{candidate.examId || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>Status:</span>
                                            <Badge variant={
                                                candidate.status === 'Flagged' ? 'destructive'
                                                : candidate.status === 'Finished' ? 'secondary'
                                                : candidate.status === 'In Progress' ? 'default'
                                                : 'outline'
                                            }>{candidate.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {type === 'result' && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Exam Result</DialogTitle>
                            <DialogDescription>Result for {candidate.name} on exam {candidate.examId}.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {candidate.status !== 'Finished' ? (
                                <div className="text-center text-muted-foreground">
                                    <p>This exam is not yet finished.</p>
                                    <p>Result will be available once the candidate completes the exam.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Final Score</p>
                                        <p className={`text-6xl font-bold ${getScoreColor(candidate.score || 0)}`}>{candidate.score || 0}<span className="text-2xl text-muted-foreground">/100</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <Progress value={candidate.score} />
                                        <p className="text-center text-sm font-medium">{(candidate.score || 0) >= 60 ? 'Passed' : 'Failed'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

interface DataTableProps {
    data: Candidate[];
    columns: any[];
    isLoading: boolean;
    isFetching: boolean;
}

const DataTable = ({ data, columns, isLoading, isFetching }: DataTableProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const page = searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('pageSize') ?? '10';

    const pageCount = Math.ceil(data.length / Number(pageSize));
    const pageIndex = parseInt(page) - 1;
    
    const paginatedData = data.slice(pageIndex * Number(pageSize), (pageIndex + 1) * Number(pageSize));

    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
          const newSearchParams = new URLSearchParams(searchParams.toString());
          for (const [key, value] of Object.entries(params)) {
            if (value === null) {
              newSearchParams.delete(key);
            } else {
              newSearchParams.set(key, String(value));
            }
          }
          return newSearchParams.toString();
        },
        [searchParams]
    );

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    {columns.map((column) => (
                        <TableHead key={String(column.accessorKey)}>
                        {column.header.sortable ? (
                            <Button
                            variant="ghost"
                            onClick={() => { /* handleSort(String(column.accessorKey)) */ }}
                            >
                            {column.header.title}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            column.header.title
                        )}
                        </TableHead>
                    ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading || isFetching ? (
                        Array.from({ length: Number(pageSize) }).map((_, i) => (
                            <TableRow key={i}>
                                {columns.map((col, j) => (
                                    <TableCell key={j}>
                                        <Skeleton className="h-6" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : paginatedData.length > 0 ? (
                    paginatedData.map((row) => (
                        <TableRow key={row._id}>
                        {columns.map((column) => (
                            <TableCell key={String(column.accessorKey)}>
                            {column.cell
                                ? column.cell({ row: { original: row, getValue: (key: string) => (row as any)[key] } })
                                : (row as any)[column.accessorKey]}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                        >
                        No results found.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={pageSize}
                        onValueChange={(value) => router.push(`${pathname}?${createQueryString({ pageSize: value, page: '1' })}`)}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={`${size}`}>
                            {size}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {pageCount}
                    </span>
                <div className="flex items-center space-x-1">
                    <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`${pathname}?${createQueryString({ page: '1' })}`)}
                    disabled={pageIndex === 0}
                    >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`${pathname}?${createQueryString({ page: pageIndex })}`)}
                    disabled={pageIndex === 0}
                    >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`${pathname}?${createQueryString({ page: pageIndex + 2 })}`)}
                    disabled={pageIndex + 1 >= pageCount}
                    >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`${pathname}?${createQueryString({ page: pageCount })}`)}
                    disabled={pageIndex + 1 >= pageCount}
                    >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </div>
        </div>
    );
};


export default function CandidatesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // RTK Query Hooks
    const { data: candidatesData = [], isLoading: isFetchingCandidates, isSuccess } = useGetCandidatesQuery({});
    const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
    const [deleteCandidateApi, { isLoading: isDeleting }] = useDeleteCandidateMutation();

    // Modal state
    const [modalState, setModalState] = useState<{ type: 'view' | 'result' | null; candidate: Candidate | null }>({ type: null, candidate: null });
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
    const [candidateToReject, setCandidateToReject] = useState<Candidate | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Search and filter state
    const searchTerm = searchParams.get('search') ?? '';
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);
    
    // Filtered data based on search term
    const filteredCandidates = React.useMemo(() => {
        if (!isSuccess) return [];
        let dataToFilter = [...candidatesData];
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
             const searchableColumns: (keyof Candidate)[] = ['name', 'email', 'examId', 'college', 'role', 'phoneNumber', 'govIdNumber'];
            dataToFilter = dataToFilter.filter(
                (candidate) =>
                searchableColumns.some(key =>
                    String(candidate[key] ?? '').toLowerCase().includes(term)
                )
            );
        }
        return dataToFilter;
    }, [candidatesData, debouncedSearchTerm, isSuccess]);

    // Data for each tab
    const students = React.useMemo(() => filteredCandidates.filter(c => c.role === 'student'), [filteredCandidates]);
    const professionals = React.useMemo(() => filteredCandidates.filter(c => c.role === 'professional'), [filteredCandidates]);
    const examiners = React.useMemo(() => filteredCandidates.filter(c => c.role === 'examiner'), [filteredCandidates]);
    const admins = React.useMemo(() => filteredCandidates.filter(c => c.role === 'admin'), [filteredCandidates]);
    
    const handleOpenModal = (type: 'view' | 'result', candidate: Candidate) => {
        setModalState({ type, candidate });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, candidate: null });
    };

    const handleDeleteClick = (candidate: Candidate) => {
        setCandidateToDelete(candidate);
    };

    const handleDeleteConfirm = async () => {
        if (candidateToDelete) {
            try {
                await deleteCandidateApi(candidateToDelete._id).unwrap();
                toast({ title: 'Success', description: 'Candidate deleted successfully.' });
                setCandidateToDelete(null);
            } catch (err: any) {
                toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to delete candidate.' });
            }
        }
    };
    
    const handleApproval = async (candidate: Candidate, newStatus: 'Approved' | 'Rejected', reason?: string) => {
        try {
            await updateCandidate({ id: candidate._id, approvalStatus: newStatus, rejectionReason: reason }).unwrap();
            toast({ title: 'Success', description: `Candidate has been ${newStatus.toLowerCase()}.`});
            if(candidateToReject) setCandidateToReject(null);
            setRejectionReason('');
        } catch (err: any) {
             toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to update candidate status.' });
        }
    }

    const handleApprovalToggle = (candidate: Candidate, approved: boolean) => {
        if (approved) {
            handleApproval(candidate, 'Approved');
        } else {
            setCandidateToReject(candidate);
        }
    }

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`${pathname}?${createQueryString({ search: debouncedSearchTerm || null, page: '1' })}`);
        }, 500);
        return () => clearTimeout(timer);
    }, [debouncedSearchTerm, pathname, router]);

    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
          const newSearchParams = new URLSearchParams(searchParams.toString());
          for (const [key, value] of Object.entries(params)) {
            if (value === null) {
              newSearchParams.delete(key);
            } else {
              newSearchParams.set(key, String(value));
            }
          }
          return newSearchParams.toString();
        },
        [searchParams]
    );

    const stats = React.useMemo(() => {
        const total = candidatesData.length;
        const finished = candidatesData.filter(c => c.status === 'Finished').length;
        const flagged = candidatesData.filter(c => c.status === 'Flagged').length;
        const inProgress = candidatesData.filter(c => c.status === 'In Progress').length;
        const pendingApproval = candidatesData.filter(c => c.approvalStatus === 'Pending').length;
        return { total, finished, flagged, inProgress, pendingApproval };
    }, [candidatesData]);


    const getBaseColumns = (includeExamStatus = true) => [
        {
            accessorKey: 'name',
            header: { title: 'Name', sortable: true },
            cell: ({ row }: { row: { original: Candidate } }) => <div className="font-medium">{row.original.name}</div>,
        },
        {
            accessorKey: 'email',
            header: { title: 'Email', sortable: true },
        },
        {
            accessorKey: 'college',
            header: { title: 'Organization / Institute', sortable: true },
        },
        ...(includeExamStatus ? [{
            accessorKey: 'status',
            header: { title: 'Exam Status', sortable: true },
            cell: ({ row }: { row: { original: Candidate } }) => {
                const status = row.original.status;
                return (
                    <Badge variant={ status ? (
                        status === 'Flagged' ? 'destructive'
                        : status === 'Finished' ? 'secondary'
                        : status === 'In Progress' ? 'default' : 'outline') : 'outline'
                    }>
                        {status || 'N/A'}
                    </Badge>
                );
            },
        }] : []),
        {
            accessorKey: 'actions',
            header: { title: 'Actions' },
            cell: ({ row }: { row: { original: Candidate } }) => (
                <div className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenModal('view', row.original)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenModal('result', row.original)}>Result</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(row.original)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const studentColumns = getBaseColumns(true);
    const professionalColumns = getBaseColumns(true);
    const adminColumns = getBaseColumns(false);

    const examinerColumns = [
        ...getBaseColumns(false).filter(c => c.accessorKey !== 'actions'),
        {
            accessorKey: 'approvalStatus',
            header: { title: 'Approval' },
            cell: ({ row }: { row: { original: Candidate } }) => {
                const status = row.original.approvalStatus;
                const isApproved = status === 'Approved';
                 return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isApproved}
                            onCheckedChange={(checked) => handleApprovalToggle(row.original, checked)}
                            aria-label="Approval toggle"
                            disabled={status === 'Rejected' || isUpdating}
                        />
                        <Badge variant={
                            status === 'Approved' ? 'secondary' :
                            status === 'Rejected' ? 'destructive' :
                            'default'
                        }>{status}</Badge>
                    </div>
                )
            }
        },
         {
            accessorKey: 'actions',
            header: { title: 'Actions' },
            cell: ({ row }: { row: { original: Candidate } }) => (
                <div className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenModal('view', row.original)}>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(row.original)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];
    
    const PageContent = () => (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Candidates</h1>
                <p className="text-muted-foreground">
                    View and manage all registered users and examiner approvals.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingApproval}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Finished Exam</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.finished}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Flagged Sessions</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.flagged}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Filter users by role and manage examiner approvals.
                    </CardDescription>
                    <div className="pt-4">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Search all candidates...`}
                                value={debouncedSearchTerm}
                                onChange={(e) => setDebouncedSearchTerm(e.target.value)}
                                className="pl-10 w-full md:w-80"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="student">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="student">Students ({students.length})</TabsTrigger>
                            <TabsTrigger value="professional">Professionals ({professionals.length})</TabsTrigger>
                            <TabsTrigger value="examiner">Examiners ({examiners.length})</TabsTrigger>
                            <TabsTrigger value="admin">Admins ({admins.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="student" className="mt-4">
                             <DataTable data={students} columns={studentColumns} isLoading={isFetchingCandidates} isFetching={isFetchingCandidates} />
                        </TabsContent>
                         <TabsContent value="professional" className="mt-4">
                             <DataTable data={professionals} columns={professionalColumns} isLoading={isFetchingCandidates} isFetching={isFetchingCandidates} />
                        </TabsContent>
                         <TabsContent value="examiner" className="mt-4">
                             <DataTable data={examiners} columns={examinerColumns} isLoading={isFetchingCandidates} isFetching={isFetchingCandidates} />
                        </TabsContent>
                         <TabsContent value="admin" className="mt-4">
                             <DataTable data={admins} columns={adminColumns} isLoading={isFetchingCandidates} isFetching={isFetchingCandidates} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <>
            <CandidateModal modalState={modalState} onOpenChange={(open) => !open && handleCloseModal()} />
            {candidateToDelete && (
                 <AlertDialog open={!!candidateToDelete} onOpenChange={(open) => !open && setCandidateToDelete(null)}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the candidate "{candidateToDelete.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCandidateToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
             <Dialog open={!!candidateToReject} onOpenChange={(open) => !open && setCandidateToReject(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for Rejection</DialogTitle>
                        <DialogDescription>
                            Provide a reason for rejecting "{candidateToReject?.name}". This will be stored for your records.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="rejectionReason">Rejection Notes</Label>
                        <Textarea 
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., The provided identification was not clear."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCandidateToReject(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleApproval(candidateToReject!, 'Rejected', rejectionReason)} disabled={isUpdating}>
                            {isUpdating ? 'Confirming...' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <PageContent />
        </>
    );
}
    

