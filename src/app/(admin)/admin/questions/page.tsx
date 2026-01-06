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
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Search,
    PlusCircle,
    Trash,
    Edit
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { QuestionDialog } from '@/components/examiner/create-test-form';
import type { Question } from '@/components/examiner/create-test-form';


const questionsData: Question[] = [
    { id: 'q1', type: 'mcq', text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswer: 'Paris', marks: 1, negativeMarks: 0},
    { id: 'q2', type: 'descriptive', text: 'Explain the theory of relativity.', marks: 5, negativeMarks: 0},
    { id: 'q3', type: 'mcq', text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4', marks: 1, negativeMarks: 0},
    { id: 'q4', type: 'mcq', text: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 'Mars', marks: 1, negativeMarks: 0 },
    { id: 'q5', type: 'descriptive', text: 'What is photosynthesis?', marks: 3, negativeMarks: 0},
];

export default function QuestionBankPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Modal states
    const [modalState, setModalState] = useState<{ type: 'add' | 'edit' | null; question: Question | null }>({ type: null, question: null });
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

    // Search params
    const page = searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('pageSize') ?? '5';
    const searchTerm = searchParams.get('search') ?? '';
    const sortParam = searchParams.get('sort');

    const [data, setData] = React.useState<Question[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);

    const searchableColumns: (keyof Question)[] = ['text', 'type'];

    const handleOpenModal = (type: 'add' | 'edit', question: Question | null = null) => {
        setModalState({ type, question });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, question: null });
    };

    const handleSaveQuestion = (questionData: Question) => {
        if (modalState.type === 'edit' && modalState.question) {
            console.log('Updating question:', modalState.question.id, questionData);
        } else {
            console.log('Adding new question:', questionData);
        }
        handleCloseModal();
    }

    const handleDeleteClick = (question: Question) => {
        setQuestionToDelete(question);
    };

    const handleDeleteConfirm = () => {
        if (questionToDelete) {
            console.log(`Deleting question ${questionToDelete.id}`);
            setQuestionToDelete(null);
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

    const columns: DataTableColumnDef<Question>[] = [
        {
            accessorKey: 'text',
            header: {
                title: 'Question Text',
                sortable: true,
            },
            cell: ({ row }) => <div className="font-medium max-w-md truncate">{row.getValue('text')}</div>,
        },
        {
            accessorKey: 'type',
            header: {
                title: 'Type',
                sortable: true,
            },
            cell: ({ row }) => <Badge variant="outline" className="uppercase">{row.getValue('type')}</Badge>,
        },
        {
            accessorKey: 'marks',
            header: {
                title: 'Marks',
                sortable: true,
            },
             cell: ({ row }) => <div className="text-center">{row.getValue('marks')}</div>
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
                        <DropdownMenuItem onClick={() => handleOpenModal('edit', row.original)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(row.original)}>
                            <Trash className="mr-2 h-4 w-4"/>
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

        let filteredQuestions = questionsData;

        if (options.searchTerm) {
            const term = options.searchTerm.toLowerCase();
            filteredQuestions = questionsData.filter(
                (q) =>
                searchableColumns.some(key =>
                    String(q[key]).toLowerCase().includes(term)
                )
            );
        }
        
        if (options.sort) {
            filteredQuestions.sort((a, b) => {
                const key = options.sort!.id as keyof Question;
                if (a[key] < b[key]) return options.sort!.desc ? 1 : -1;
                if (a[key] > b[key]) return options.sort!.desc ? -1 : 1;
                return 0;
            });
        }
        
        const start = options.pageIndex * options.pageSize;
        const end = start + options.pageSize;
        const pageData = filteredQuestions.slice(start, end);
        
        return {
            data: pageData,
            pageCount: Math.ceil(filteredQuestions.length / options.pageSize),
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

    const PageContent = () => (
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-bold">Question Bank</h1>
                <p className="text-muted-foreground">
                    Manage the central repository of questions for all tests.
                </p>
                </div>
                 <QuestionDialog onSave={handleSaveQuestion}>
                     <Button>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add Question
                    </Button>
                </QuestionDialog>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>All Questions</CardTitle>
                    <CardDescription>
                         <div className="flex items-center justify-between gap-4">
                            <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Search questions...`}
                                value={debouncedSearchTerm}
                                onChange={(e) => setDebouncedSearchTerm(e.target.value)}
                                className="pl-10 w-full md:w-80"
                            />
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                            data.map((row) => (
                                <TableRow key={row.id}>
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

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
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
                </CardContent>
            </Card>
        </div>
    );

    return (
        <>
            {questionToDelete && (
                <AlertDialog open={!!questionToDelete} onOpenChange={(open) => !open && setQuestionToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the question.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setQuestionToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <PageContent />
        </>
    )
}