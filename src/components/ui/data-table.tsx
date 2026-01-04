'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from './skeleton';

export interface DataTableColumnDef<TData> {
  accessorKey: keyof TData | 'actions';
  header: {
    title: string;
    sortable?: boolean;
  };
  cell?: (props: { row: { getValue: (key: string) => any } }) => React.ReactNode;
}

interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData>[];
  fetchData: (options: {
    pageIndex: number;
    pageSize: number;
    searchTerm: string;
    sort: { id: string; desc: boolean } | null;
  }) => Promise<{ data: TData[]; pageCount: number }>;
  searchableColumns: (keyof TData)[];
}

export function DataTable<TData, TValue>({
  columns,
  fetchData,
  searchableColumns,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const page = searchParams.get('page') ?? '1';
  const pageSize = searchParams.get('pageSize') ?? '5';
  const searchTerm = searchParams.get('search') ?? '';
  const sortParam = searchParams.get('sort');

  // Component state
  const [data, setData] = React.useState<TData[]>([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);
  
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


  // Fetch data
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
  );
}
