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
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type Candidate = {
  id: string;
  name: string;
  examId: string;
  status: 'Finished' | 'Flagged' | 'In Progress' | 'Not Started';
};

const candidatesData: Candidate[] = [
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
  { id: 'user6', name: 'Frank White', examId: 'CS101-FINAL', status: 'Finished' },
  { id: 'user7', name: 'Grace Lee', examId: 'MA203-MIDTERM', status: 'In Progress' },
  { id: 'user8', name: 'Henry Scott', examId: 'PHY201-QUIZ3', status: 'Flagged' },
  { id: 'user9', name: 'Ivy Green', examId: 'BIO-101', status: 'Not Started' },
  { id: 'user10', name: 'Jack King', examId: 'CS101-FINAL', status: 'Finished' },
  { id: 'user11', name: 'Kate Hill', examId: 'MA203-MIDTERM', status: 'In Progress' },
  { id: 'user12', name: 'Liam Hall', examId: 'PHY201-QUIZ3', status: 'Finished' },
  { id: 'user13', name: 'Mia Adams', examId: 'BIO-101', status: 'Not Started' },
  { id: 'user14', name: 'Noah Baker', examId: 'CS101-FINAL', status: 'Flagged' },
  { id: 'user15', name: 'Olivia Clark', examId: 'MA203-MIDTERM', status: 'In Progress' },
];

interface DataTableColumnDef<TData> {
    accessorKey: keyof TData | 'actions';
    header: {
      title: string;
      sortable?: boolean;
    };
    cell?: (props: { row: { getValue: (key: string) => any } }) => React.ReactNode;
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
];

export default function CandidatesPage() {
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

    const searchableColumns: (keyof Candidate)[] = ['name', 'examId'];

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
                candidate.name.toLowerCase().includes(term) ||
                candidate.examId.toLowerCase().includes(term)
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
                    View and manage all registered candidates.
                </p>
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
                                    ? column.cell({ row: { getValue: (key) => (row as any)[key] } })
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
