'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, ArrowUpDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, FileText, CheckCircle, FileClock, Edit, PlusCircle, UserPlus, Eye, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Test } from '@/app/(admin)/admin/tests/page';
import { TestDetailsCard } from '@/components/examiner/test-details-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetTestsQuery } from '@/services/api';


export default function TestsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // RTK Query
    const { data: testsData = [], isLoading: isFetchingTests } = useGetTestsQuery({});

    // Search params
    const page = searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('pageSize') ?? '5';
    const searchTerm = searchParams.get('search') ?? '';
    const sortParam = searchParams.get('sort');

    // Component state
    const [data, setData] = React.useState<Test[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);
    const [viewingTest, setViewingTest] = React.useState<Test | null>(null);
    
    const searchableColumns: (keyof Test)[] = ['id', 'title'];

     interface DataTableColumnDef<TData> {
        accessorKey: keyof TData | 'actions' | '_id';
        header: {
          title: string;
          sortable?: boolean;
        };
        cell?: (props: { row: { original: TData, getValue: (key: string) => any } }) => React.ReactNode;
    }

    const columns: DataTableColumnDef<Test>[] = [
      {
        accessorKey: '_id',
        header: {
          title: 'Test ID',
          sortable: true,
        },
        cell: ({ row }) => <div className="font-medium truncate max-w-28">{row.getValue('_id')}</div>,
      },
      {
        accessorKey: 'title',
        header: {
          title: 'Title',
          sortable: true,
        },
      },
      {
        accessorKey: 'candidates',
        header: {
          title: 'Candidates',
          sortable: true,
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('candidates')}</div>
      },
      {
        accessorKey: 'marks',
        header: {
          title: 'Total Marks',
          sortable: true,
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('marks')}</div>
      },
      {
        accessorKey: 'status',
        header: {
          title: 'Status',
          sortable: true,
        },
        cell: ({ row }) => {
          const status = row.getValue('status') as Test['status'];
          return (
            <Badge
              variant={
                status === 'Active'
                  ? 'default'
                  : status === 'Finished'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'approval',
        header: {
          title: 'Approval Status',
          sortable: true,
        },
        cell: ({ row }) => {
            const approval = row.getValue('approval') as Test['approval'];
            const reason = row.original.rejectionReason;
            const badge = (
                <Badge
                    variant={
                        approval === 'Approved' ? 'default'
                        : approval === 'Rejected' ? 'destructive'
                        : 'secondary'
                    }
                    className={
                        approval === 'Approved' ? 'bg-foreground text-background' 
                        : approval === 'Rejected' ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted text-muted-foreground'
                    }
                >
                    {approval}
                </Badge>
            );

            if (approval === 'Rejected' && reason) {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2">
                                {badge}
                                <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">{reason}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            }
            return badge;
        },
      },
      {
        accessorKey: 'actions',
        header: { title: 'Actions' },
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
                 <DropdownMenuItem onSelect={() => setViewingTest(row.original)}>
                  <Eye className="mr-2 h-4 w-4"/> View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/examiner/tests/edit/${row.original.id}`} className="flex w-full items-center"><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/examiner/assignments/${row.original.id}`} className="flex w-full items-center"><UserPlus className="mr-2 h-4 w-4" /> Assign Candidates</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>View Results</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ];

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
        const total = testsData.length;
        const active = testsData.filter(t => t.status === 'Active').length;
        const finished = testsData.filter(t => t.status === 'Finished').length;
        const draft = testsData.filter(t => t.status === 'Draft').length;
        return { total, active, finished, draft };
    }, [testsData]);

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
        let filteredTests = testsData;

        if (options.searchTerm) {
            const term = options.searchTerm.toLowerCase();
            filteredTests = testsData.filter(
                (test: Test) =>
                (test.id && test.id.toLowerCase().includes(term)) ||
                (test.title && test.title.toLowerCase().includes(term))
            );
        }

        if (options.sort) {
            filteredTests.sort((a, b) => {
                const key = options.sort!.id as keyof Test;
                if (a[key] < b[key]) return options.sort!.desc ? 1 : -1;
                if (a[key] > b[key]) return options.sort!.desc ? -1 : 1;
                return 0;
            });
        }
        
        const start = options.pageIndex * options.pageSize;
        const end = start + options.pageSize;
        const pageData = filteredTests.slice(start, end);

        return {
            data: pageData,
            pageCount: Math.ceil(filteredTests.length / options.pageSize),
        };
    }, [testsData]);

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
    }, [pageIndex, pageSize, searchTerm, sort, fetchData, testsData]);


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
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-2xl font-bold">Tests</h1>
                    <p className="text-muted-foreground">
                        Create, manage, and view results for all your tests.
                    </p>
                    </div>
                    <Button asChild>
                        <Link href="/examiner/tests/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Test
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
                            <FileClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Finished Tests</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.finished}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.draft}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ID, title...`}
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
                            {isLoading || isFetchingTests ? (
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
                            data.map((row: Test, index) => (
                                <TableRow key={row._id || index}>
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
            <Dialog open={!!viewingTest} onOpenChange={(open) => !open && setViewingTest(null)}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Test Details</DialogTitle>
                        <DialogDescription>
                            A comprehensive overview of your test configuration and rules.
                        </DialogDescription>
                    </DialogHeader>
                    {viewingTest && (
                       <div className="max-h-[70vh] overflow-y-auto p-1">
                            <TestDetailsCard test={viewingTest} />
                       </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
