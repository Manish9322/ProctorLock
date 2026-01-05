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
} from '@/components/ui/dialog';
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
    Award
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Candidate = {
  id: string;
  name: string;
  examId: string;
  status: 'Finished' | 'Flagged' | 'In Progress' | 'Not Started';
  college: string;
  role: string;
  phoneNumber: string;
  score: number;
};

const candidatesData: Candidate[] = [
  { id: 'user1', name: 'Alice Johnson', examId: 'CS101-FINAL', status: 'Finished', college: 'Stanford University', role: 'Student', phoneNumber: '123-456-7890', score: 88 },
  { id: 'user2', name: 'Bob Williams', examId: 'MA203-MIDTERM', status: 'Flagged', college: 'MIT', role: 'Student', phoneNumber: '234-567-8901', score: 65 },
  { id: 'user3', name: 'Charlie Brown', examId: 'PHY201-QUIZ3', status: 'In Progress', college: 'Harvard University', role: 'Professional', phoneNumber: '345-678-9012', score: 72 },
  { id: 'user4', name: 'Diana Miller', examId: 'CS101-FINAL', status: 'Finished', college: 'UC Berkeley', role: 'Student', phoneNumber: '456-789-0123', score: 95 },
  { id: 'user5', name: 'Eve Davis', examId: 'BIO-101', status: 'Not Started', college: 'Yale University', role: 'Student', phoneNumber: '567-890-1234', score: 0 },
  { id: 'user6', name: 'Frank White', examId: 'CS101-FINAL', status: 'Finished', college: 'Princeton University', role: 'Professional', phoneNumber: '678-901-2345', score: 91 },
  { id: 'user7', name: 'Grace Lee', examId: 'MA203-MIDTERM', status: 'In Progress', college: 'Columbia University', role: 'Student', phoneNumber: '789-012-3456', score: 82 },
  { id: 'user8', name: 'Henry Scott', examId: 'PHY201-QUIZ3', status: 'Flagged', college: 'University of Chicago', role: 'Student', phoneNumber: '890-123-4567', score: 55 },
  { id: 'user9', name: 'Ivy Green', examId: 'BIO-101', status: 'Not Started', college: 'Duke University', role: 'Professional', phoneNumber: '901-234-5678', score: 0 },
  { id: 'user10', name: 'Jack King', examId: 'CS101-FINAL', status: 'Finished', college: 'Northwestern University', role: 'Student', phoneNumber: '012-345-6789', score: 78 },
  { id: 'user11', name: 'Kate Hill', examId: 'MA203-MIDTERM', status: 'In Progress', college: 'Johns Hopkins University', role: 'Student', phoneNumber: '111-222-3333', score: 85 },
  { id: 'user12', name: 'Liam Hall', examId: 'PHY201-QUIZ3', status: 'Finished', college: 'University of Pennsylvania', role: 'Professional', phoneNumber: '444-555-6666', score: 98 },
  { id: 'user13', name: 'Mia Adams', examId: 'BIO-101', status: 'Not Started', college: 'Caltech', role: 'Student', phoneNumber: '777-888-9999', score: 0 },
  { id: 'user14', name: 'Noah Baker', examId: 'CS101-FINAL', status: 'Flagged', college: 'Cornell University', role: 'Student', phoneNumber: '121-314-151', score: 71 },
  { id: 'user15', name: 'Olivia Clark', examId: 'MA203-MIDTERM', status: 'In Progress', college: 'Brown University', role: 'Professional', phoneNumber: '617-181-920', score: 79 },
];

const ViewDetailsModal = ({ candidate, open, onOpenChange }: { candidate: Candidate | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!candidate) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Candidate Details</DialogTitle>
                    <DialogDescription>Full information for {candidate.name}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{candidate.name}</span>
                        <Badge variant="secondary" className="ml-auto">{candidate.role}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{candidate.college}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{candidate.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Exam: {candidate.examId}</span>
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
            </DialogContent>
        </Dialog>
    );
};

const ResultModal = ({ candidate, open, onOpenChange }: { candidate: Candidate | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!candidate) return null;

    const getScoreColor = (score: number) => {
        if (score < 60) return "text-destructive";
        if (score < 80) return "text-amber-500";
        return "text-green-500";
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
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
                            <p className={`text-6xl font-bold ${getScoreColor(candidate.score)}`}>{candidate.score}<span className="text-2xl text-muted-foreground">/100</span></p>
                        </div>
                        <div className="space-y-2">
                             <Progress value={candidate.score} />
                             <p className="text-center text-sm font-medium">{candidate.score >= 60 ? 'Passed' : 'Failed'}</p>
                        </div>
                    </div>
                 )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function CandidatesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Modal state
    const [modalState, setModalState] = useState<{ type: 'view' | 'result' | null; candidate: Candidate | null }>({ type: null, candidate: null });

    // Search params
    const page = searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('pageSize') ?? '5';
    const searchTerm = searchParams.get('search') ?? '';
    const sortParam = searchParams.get('sort');

    // Component state
    const [data, setData] = React.useState<Candidate[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);

    const searchableColumns: (keyof Candidate)[] = ['name', 'examId', 'college', 'role'];
    
    const handleOpenModal = (type: 'view' | 'result', candidate: Candidate) => {
        setModalState({ type, candidate });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, candidate: null });
    };

    const columns: DataTableColumnDef<Candidate>[] = [
        {
            accessorKey: 'name',
            header: {
                title: 'Name',
                sortable: true,
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'college',
            header: {
                title: 'College/Institute',
                sortable: true,
            },
        },
         {
            accessorKey: 'role',
            header: {
                title: 'Role',
                sortable: true,
            },
        },
         {
            accessorKey: 'phoneNumber',
            header: {
                title: 'Phone Number',
                sortable: false,
            },
        },
        {
            accessorKey: 'examId',
            header: {
                title: 'Current Exam',
                sortable: true,
            },
        },
        {
            accessorKey: 'status',
            header: {
                title: 'Status',
                sortable: true,
            },
            cell: ({ row }) => {
                const status = row.getValue('status') as Candidate['status'];
                return (
                    <Badge
                        variant={
                            status === 'Flagged'
                            ? 'destructive'
                            : status === 'Finished'
                            ? 'secondary'
                            : status === 'In Progress'
                            ? 'default'
                            : 'outline'
                        }
                        >
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'actions',
            header: {
                title: 'Actions',
            },
            cell: ({ row }) => (
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
                        <DropdownMenuItem className="text-destructive">
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    interface DataTableColumnDef<TData> {
        accessorKey: keyof TData | 'actions';
        header: {
          title: string;
          sortable?: boolean;
        };
        cell?: (props: { row: { original: TData, getValue: (key: string) => any } }) => React.ReactNode;
    }


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

    const pageIndex = parseInt(page) - 1;

    const sort = React.useMemo(() => {
        if (sortParam) {
          const [id, dir] = sortParam.split('.');
          return { id, desc: dir === 'desc' };
        }
        return null;
    }, [sortParam]);

    const stats = React.useMemo(() => {
        const total = candidatesData.length;
        const finished = candidatesData.filter(c => c.status === 'Finished').length;
        const flagged = candidatesData.filter(c => c.status === 'Flagged').length;
        const inProgress = candidatesData.filter(c => c.status === 'In Progress').length;
        return { total, finished, flagged, inProgress };
    }, []);

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`${pathname}?${createQueryString({ search: debouncedSearchTerm || null, page: '1' })}`);
        }, 500);
        return () => clearTimeout(timer);
    }, [debouncedSearchTerm, pathname, router, createQueryString]);

    // Mock fetch data
    const fetchData = React.useCallback(async (options: {
        pageIndex: number;
        pageSize: number;
        searchTerm: string;
        sort: { id: string; desc: boolean } | null;
    }) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        let filteredCandidates = candidatesData;

        if (options.searchTerm) {
            const term = options.searchTerm.toLowerCase();
            filteredCandidates = candidatesData.filter(
                (candidate) =>
                searchableColumns.some(key =>
                    String(candidate[key]).toLowerCase().includes(term)
                )
            );
        }
        
        if (options.sort) {
            filteredCandidates.sort((a, b) => {
                const key = options.sort!.id as keyof Candidate;
                if (a[key] < b[key]) return options.sort!.desc ? 1 : -1;
                if (a[key] > b[key]) return options.sort!.desc ? -1 : 1;
                return 0;
            });
        }
        
        const start = options.pageIndex * options.pageSize;
        const end = start + options.pageSize;
        const pageData = filteredCandidates.slice(start, end);
        
        return {
            data: pageData,
            pageCount: Math.ceil(filteredCandidates.length / options.pageSize),
        };
    }, []);

    // Fetch data effect
    React.useEffect(() => {
        setIsLoading(true);
        fetchData({
            pageIndex,
            pageSize: Number(pageSize),
            searchTerm,
            sort
        }).then(({ data, pageCount }) => {
            setData(data);
            setPageCount(pageCount);
            setIsLoading(false);
        });
    }, [pageIndex, pageSize, searchTerm, sort, fetchData]);


    const handleSort = (columnId: string) => {
        let newSort;
        if (sort && sort.id === columnId) {
            if (sort.desc) {
                newSort = null; // cycle off
            } else {
                newSort = `${columnId}.desc`;
            }
        } else {
            newSort = `${columnId}.asc`;
        }
        router.push(`${pathname}?${createQueryString({ sort: newSort, page: '1' })}`);
    };

    return (
        <>
            <ViewDetailsModal candidate={modalState.candidate} open={modalState.type === 'view'} onOpenChange={handleCloseModal} />
            <ResultModal candidate={modalState.candidate} open={modalState.type === 'result'} onOpenChange={handleCloseModal} />
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold">Candidates</h1>
                    <p className="text-muted-foreground">
                        View and manage all registered candidates.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
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
                        <CardTitle className="text-sm font-medium">Flagged</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.flagged}</div>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                    </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${searchableColumns.join(', ')}...`}
                            value={debouncedSearchTerm}
                            onChange={(e) => setDebouncedSearchTerm(e.target.value)}
                            className="pl-10 w-full md:w-80"
                        />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            {columns.map((column) => (
                                <TableHead key={String(column.accessorKey)}>
                                {column.header.sortable ? (
                                    <Button
                                    variant="ghost"
                                    onClick={() => handleSort(String(column.accessorKey))}
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
                            {isLoading ? (
                                Array.from({ length: Number(pageSize) }).map((_, i) => (
                                    <TableRow key={i}>
                                        {columns.map((col, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-6" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={String(column.accessorKey)}>
                                    {column.cell
                                        ? column.cell({ row: { original: row, getValue: (key) => (row as any)[key] } })
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
            </div>
        </>
    );
}