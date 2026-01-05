'use client';
import React from 'react';
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
    ArrowRight,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Users,
    CheckCircle,
    AlertTriangle,
    Clock,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type Candidate = {
  id: string;
  name: string;
  examId: string;
  status: 'Finished' | 'Flagged' | 'In Progress' | 'Not Started';
  college: string;
  role: string;
  phoneNumber: string;
};

const candidatesData: Candidate[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    examId: 'CS101-FINAL',
    status: 'Finished',
    college: 'Stanford University',
    role: 'Student',
    phoneNumber: '123-456-7890',
  },
  {
    id: 'user2',
    name: 'Bob Williams',
    examId: 'MA203-MIDTERM',
    status: 'Flagged',
    college: 'MIT',
    role: 'Student',
    phoneNumber: '234-567-8901',
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    examId: 'PHY201-QUIZ3',
    status: 'In Progress',
    college: 'Harvard University',
    role: 'Professional',
    phoneNumber: '345-678-9012',
  },
  {
    id: 'user4',
    name: 'Diana Miller',
    examId: 'CS101-FINAL',
    status: 'Finished',
    college: 'UC Berkeley',
    role: 'Student',
    phoneNumber: '456-789-0123',
  },
  {
    id: 'user5',
    name: 'Eve Davis',
    examId: 'BIO-101',
    status: 'Not Started',
    college: 'Yale University',
    role: 'Student',
    phoneNumber: '567-890-1234',
  },
  { id: 'user6', name: 'Frank White', examId: 'CS101-FINAL', status: 'Finished', college: 'Princeton University', role: 'Professional', phoneNumber: '678-901-2345' },
  { id: 'user7', name: 'Grace Lee', examId: 'MA203-MIDTERM', status: 'In Progress', college: 'Columbia University', role: 'Student', phoneNumber: '789-012-3456' },
  { id: 'user8', name: 'Henry Scott', examId: 'PHY201-QUIZ3', status: 'Flagged', college: 'University of Chicago', role: 'Student', phoneNumber: '890-123-4567' },
  { id: 'user9', name: 'Ivy Green', examId: 'BIO-101', status: 'Not Started', college: 'Duke University', role: 'Professional', phoneNumber: '901-234-5678' },
  { id: 'user10', name: 'Jack King', examId: 'CS101-FINAL', status: 'Finished', college: 'Northwestern University', role: 'Student', phoneNumber: '012-345-6789' },
];

interface DataTableColumnDef<TData> {
    accessorKey: keyof TData | 'actions';
    header: {
      title: string;
      sortable?: boolean;
    };
    cell?: (props: { row: { original: TData, getValue: (key: string) => any } }) => React.ReactNode;
}

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
                <Button asChild variant="ghost" size="icon">
                    <Link href={`/examiner/monitoring/${row.original.id}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">Monitor Candidate</span>
                    </Link>
                </Button>
            </div>
        ),
    },
];

export default function ExaminerCandidatesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Candidates</h1>
                <p className="text-muted-foreground">
                    View and manage all candidates for your exams.
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
    );
}
