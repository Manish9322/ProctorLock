'use client';
import React from 'react';
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
    MoreHorizontal,
    Search,
    School,
    Book,
    Briefcase
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type College = {
  id: string;
  name: string;
  type: 'University' | 'Organization' | 'Institute';
  registrations: number;
};

const collegesData: College[] = [
  { id: 'col1', name: 'Stanford University', type: 'University', registrations: 125 },
  { id: 'col2', name: 'MIT', type: 'University', registrations: 98 },
  { id: 'col3', name: 'Harvard University', type: 'University', registrations: 110 },
  { id: 'col4', name: 'UC Berkeley', type: 'University', registrations: 210 },
  { id: 'col5', name: 'Acme Corporation', type: 'Organization', registrations: 45 },
  { id: 'col6', name: 'Yale University', type: 'University', registrations: 80 },
  { id: 'col7', name: 'Princeton University', type: 'University', registrations: 75 },
  { id: 'col8', name: 'Innovate Inc.', type: 'Organization', registrations: 32 },
  { id: 'col9', name: 'Columbia University', type: 'University', registrations: 150 },
  { id: 'col10', name: 'Tech Solutions LLC', type: 'Organization', registrations: 60 },
];

interface DataTableColumnDef<TData> {
    accessorKey: keyof TData | 'actions';
    header: {
      title: string;
      sortable?: boolean;
    };
    cell?: (props: { row: { getValue: (key: string) => any } }) => React.ReactNode;
}

const columns: DataTableColumnDef<College>[] = [
    {
        accessorKey: 'name',
        header: {
            title: 'Name',
            sortable: true,
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'type',
        header: {
            title: 'Type',
            sortable: true,
        },
    },
     {
        accessorKey: 'registrations',
        header: {
            title: 'Registrations',
            sortable: true,
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('registrations')}</div>
    },
    {
        accessorKey: 'actions',
        header: {
            title: 'Actions',
        },
        cell: () => (
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                    Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];

export default function CollegesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('pageSize') ?? '5';
    const searchTerm = searchParams.get('search') ?? '';
    const sortParam = searchParams.get('sort');

    const [data, setData] = React.useState<College[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);

    const searchableColumns: (keyof College)[] = ['name', 'type'];

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
        const total = collegesData.length;
        const universities = collegesData.filter(c => c.type === 'University').length;
        const organizations = collegesData.filter(c => c.type === 'Organization').length;
        const institutes = collegesData.filter(c => c.type === 'Institute').length;
        return { total, universities, organizations, institutes };
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`${pathname}?${createQueryString({ search: debouncedSearchTerm || null, page: '1' })}`);
        }, 500);
        return () => clearTimeout(timer);
    }, [debouncedSearchTerm, pathname, router, createQueryString]);

    const fetchData = React.useCallback(async (options: {
        pageIndex: number;
        pageSize: number;
        searchTerm: string;
        sort: { id: string; desc: boolean } | null;
    }) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredColleges = collegesData;

        if (options.searchTerm) {
            const term = options.searchTerm.toLowerCase();
            filteredColleges = collegesData.filter(
                (college) =>
                searchableColumns.some(key =>
                    String(college[key]).toLowerCase().includes(term)
                )
            );
        }
        
        if (options.sort) {
            filteredColleges.sort((a, b) => {
                const key = options.sort!.id as keyof College;
                if (a[key] < b[key]) return options.sort!.desc ? 1 : -1;
                if (a[key] > b[key]) return options.sort!.desc ? -1 : 1;
                return 0;
            });
        }
        
        const start = options.pageIndex * options.pageSize;
        const end = start + options.pageSize;
        const pageData = filteredColleges.slice(start, end);
        
        return {
            data: pageData,
            pageCount: Math.ceil(filteredColleges.length / options.pageSize),
        };
    }, []);

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
                newSort = null;
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
             <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-bold">Colleges & Institutes</h1>
                <p className="text-muted-foreground">
                    Manage colleges, institutes, and organizations.
                </p>
                </div>
                <Button>Add New</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Universities</CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.universities}</div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.organizations}</div>
                </CardContent>
                </Card>
                 <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Institutes</CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.institutes}</div>
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
