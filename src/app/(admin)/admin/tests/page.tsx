'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, ArrowUpDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, FileText, CheckCircle, FileClock, Edit, ThumbsUp, ThumbsDown, BookCopy, Eye, Trash } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { TestDetailsCard } from '@/components/examiner/test-details-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useGetTestsQuery, useUpdateTestMutation, useDeleteTestMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
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


type TestStatus = 'Active' | 'Finished' | 'Draft';
type ApprovalStatus = 'Approved' | 'Pending' | 'Rejected';

export type Test = {
    _id: string;
    id: string;
    title: string;
    description: string;
    candidates: number;
    marks: number;
    status: TestStatus;
    approval: ApprovalStatus;
    createdBy: string;
    rejectionReason?: string;
    scheduling: {
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
    },
    questions: {
        mcqCount: number;
        descriptiveCount: number;
    },
    rules: {
        fullscreen: boolean;
        focusHandling: string;
        requireWebcam: boolean;
        snapshotInterval: string;
    }
};


export default function TestsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // RTK Query hooks
    const { data: testsData = [], isLoading: isFetchingTests } = useGetTestsQuery({});
    const [updateTest, { isLoading: isUpdatingTest }] = useUpdateTestMutation();
    const [deleteTest, { isLoading: isDeletingTest }] = useDeleteTestMutation();


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
    const [rejectingTest, setRejectingTest] = React.useState<Test | null>(null);
    const [deletingTest, setDeletingTest] = React.useState<Test | null>(null);
    const [rejectionReason, setRejectionReason] = React.useState('');
    
    const searchableColumns: (keyof Test)[] = ['id', 'title', 'createdBy'];

    const handleApprovalChange = async (testId: string, newStatus: ApprovalStatus, reason?: string) => {
        try {
            await updateTest({ id: testId, approval: newStatus, rejectionReason: reason }).unwrap();
            toast({
                title: 'Success',
                description: `Test has been ${newStatus.toLowerCase()}.`,
            });
        } catch (err) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update test status.',
            });
        }
    };
    
    const handleApprovalToggle = (test: Test, approved: boolean) => {
        if (approved) {
            handleApprovalChange(test._id, 'Approved');
        } else {
            setRejectingTest(test);
        }
    };


    const handleRejectConfirm = async () => {
        if (rejectingTest) {
            await handleApprovalChange(rejectingTest._id, 'Rejected', rejectionReason);
            setRejectingTest(null);
            setRejectionReason('');
        }
    };

    const handleDeleteConfirm = async () => {
        if (deletingTest) {
            try {
                await deleteTest(deletingTest._id).unwrap();
                toast({
                    title: 'Success',
                    description: 'Test has been deleted.',
                });
                setDeletingTest(null);
            } catch (err) {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to delete test.',
                });
            }
        }
    };

    interface DataTableColumnDef<TData> {
        accessorKey: keyof TData | 'actions';
        header: {
          title: string;
          sortable?: boolean;
        };
        cell?: (props: { row: { original: TData, getValue: (key: string) => any } }) => React.ReactNode;
    }


    const columns: DataTableColumnDef<Test>[] = [
      {
        accessorKey: 'id',
        header: {
          title: 'Test ID',
          sortable: true,
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
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
          title: 'Approval',
          sortable: true,
        },
        cell: ({ row }) => {
            const status = row.getValue('approval') as Test['approval'];
            const isApproved = status === 'Approved';
            return (
                <Switch
                    checked={isApproved}
                    onCheckedChange={(checked) => handleApprovalToggle(row.original, checked)}
                    aria-label="Approval toggle"
                    disabled={status !== 'Pending' || isUpdatingTest}
                />
            );
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
                <DropdownMenuItem className="text-destructive" onClick={() => setDeletingTest(row.original)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
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
        const pending = testsData.filter(t => t.approval === 'Pending').length;
        const approved = testsData.filter(t => t.approval === 'Approved').length;
        const rejected = testsData.filter(t => t.approval === 'Rejected').length;
        return { total, pending, approved, rejected };
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
                (test.title && test.title.toLowerCase().includes(term)) ||
                (test.createdBy && test.createdBy.toLowerCase().includes(term))
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
                    <h1 className="text-2xl font-bold">Manage Tests</h1>
                    <p className="text-muted-foreground">
                        Review, approve, and manage all created tests.
                    </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                            <BookCopy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                            <FileClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved Tests</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected Tests</CardTitle>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
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
                                <TableRow key={row._id}>
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
                            A comprehensive overview of the test configuration and rules.
                        </DialogDescription>
                    </DialogHeader>
                    {viewingTest && (
                       <div className="max-h-[70vh] overflow-y-auto p-1 no-scrollbar">
                            <TestDetailsCard test={viewingTest} />
                       </div>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={!!rejectingTest} onOpenChange={(open) => !open && setRejectingTest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for Rejection</DialogTitle>
                        <DialogDescription>
                            Provide a reason for rejecting the test "{rejectingTest?.title}". This will be shown to the examiner.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="rejectionReason">Rejection Notes</Label>
                        <Textarea 
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., The test duration is too short for the number of questions."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectingTest(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleRejectConfirm} disabled={isUpdatingTest}>
                            {isUpdatingTest ? 'Confirming...' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {deletingTest && (
                <AlertDialog open={!!deletingTest} onOpenChange={(open) => !open && setDeletingTest(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the test "{deletingTest.title}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeletingTest(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeletingTest}>
                                {isDeletingTest ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
