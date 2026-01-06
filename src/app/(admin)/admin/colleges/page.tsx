'use client';
import React, { useState } from 'react';
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
    Briefcase,
    PlusCircle,
    Trash,
    Edit
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { useGetCollegesQuery, useCreateCollegeMutation, useUpdateCollegeMutation, useDeleteCollegeMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { College } from '@/models/college.model';

const CollegeModal = ({
    modalState,
    onOpenChange,
    onSave,
    isSaving,
}: {
    modalState: { type: 'add' | 'edit' | null; college: College | null };
    onOpenChange: (open: boolean) => void;
    onSave: (college: Partial<College>) => void;
    isSaving: boolean;
}) => {
    const { type, college } = modalState;
    const [name, setName] = useState('');
    const [collegeType, setCollegeType] = useState<College['type'] | ''>('');
    const [location, setLocation] = useState('');

    React.useEffect(() => {
        if (type && college) {
            setName(college.name);
            setCollegeType(college.type);
            setLocation(college.location);
        } else {
            setName('');
            setCollegeType('');
            setLocation('');
        }
    }, [type, college]);
    
    const handleSave = () => {
        if (name && collegeType && location) {
            const collegeData: Partial<College> = { name, type: collegeType as College['type'], location };
            if (college?._id) {
                collegeData._id = college._id;
            }
            onSave(collegeData);
        }
    };
    
    if (!type) return null;
    
    const isEdit = type === 'edit';

    return (
         <Dialog open={!!type} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit' : 'Add'} College</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update the details for this entry.' : 'Add a new college, institute, or organization.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Stanford University" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={collegeType} onValueChange={(value) => setCollegeType(value as College['type'])}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="University">University</SelectItem>
                                <SelectItem value="Organization">Organization</SelectItem>
                                <SelectItem value="Institute">Institute</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Stanford, CA" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add College')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function CollegesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // RTK Query Hooks
    const { data: collegesData = [], isLoading: isFetchingColleges } = useGetCollegesQuery({});
    const [createCollege, { isLoading: isCreating }] = useCreateCollegeMutation();
    const [updateCollege, { isLoading: isUpdating }] = useUpdateCollegeMutation();
    const [deleteCollege, { isLoading: isDeleting }] = useDeleteCollegeMutation();

    // Modal states
    const [modalState, setModalState] = useState<{ type: 'add' | 'edit' | null; college: College | null }>({ type: null, college: null });
    const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null);

    // Search params
    const page = searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('pageSize') ?? '10';
    const searchTerm = searchParams.get('search') ?? '';
    const sortParam = searchParams.get('sort');

    const [data, setData] = React.useState<College[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);

    const searchableColumns: (keyof College)[] = ['name', 'type', 'location'];

    const handleOpenModal = (type: 'add' | 'edit', college: College | null = null) => {
        setModalState({ type, college });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, college: null });
    };

    const handleSaveCollege = async (collegeData: Partial<College>) => {
        try {
            if (modalState.type === 'edit' && collegeData._id) {
                await updateCollege({ id: collegeData._id, ...collegeData }).unwrap();
                toast({ title: "Success", description: "College updated successfully."});
            } else {
                await createCollege(collegeData).unwrap();
                toast({ title: "Success", description: "College added successfully."});
            }
            handleCloseModal();
        } catch (err: any) {
             toast({ variant: 'destructive', title: "Error", description: err.data?.message || "Failed to save college." });
        }
    }

    const handleDeleteClick = (college: College) => {
        setCollegeToDelete(college);
    };

    const handleDeleteConfirm = async () => {
        if (collegeToDelete) {
            try {
                await deleteCollege(collegeToDelete._id).unwrap();
                toast({ title: 'Success', description: 'College deleted successfully.'});
                setCollegeToDelete(null);
            } catch(err: any) {
                toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to delete college.' });
            }
        }
    };


    interface DataTableColumnDef<TData> {
        accessorKey: keyof TData | 'actions' | '_id';
        header: {
          title: string;
          sortable?: boolean;
        };
        cell?: (props: { row: { original: TData, getValue: (key: string) => any } }) => React.ReactNode;
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
            accessorKey: 'location',
            header: {
                title: 'Location',
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
    
    const stats = React.useMemo(() => {
        const total = collegesData.length;
        const universities = collegesData.filter(c => c.type === 'University').length;
        const organizations = collegesData.filter(c => c.type === 'Organization').length;
        const institutes = collegesData.filter(c => c.type === 'Institute').length;
        return { total, universities, organizations, institutes };
    }, [collegesData]);

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
                const valA = (a as any)[key] || '';
                const valB = (b as any)[key] || '';
                if (valA < valB) return options.sort!.desc ? 1 : -1;
                if (valA > valB) return options.sort!.desc ? -1 : 1;
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
    }, [collegesData]);

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
    }, [pageIndex, pageSize, searchTerm, sort, fetchData, collegesData]);


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
                <h1 className="text-2xl font-bold">Colleges & Institutes</h1>
                <p className="text-muted-foreground">
                    Manage colleges, institutes, and organizations.
                </p>
                </div>
                <Button onClick={() => handleOpenModal('add')}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
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
                        {isLoading || isFetchingColleges ? (
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
                            {[10, 20, 50].map((size) => (
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

    return (
        <>
            <CollegeModal
                modalState={modalState}
                onOpenChange={(open) => !open && handleCloseModal()}
                onSave={handleSaveCollege}
                isSaving={isCreating || isUpdating}
            />
            {collegeToDelete && (
                <AlertDialog open={!!collegeToDelete} onOpenChange={(open) => !open && setCollegeToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the entry for "{collegeToDelete.name}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCollegeToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <PageContent />
        </>
    )
}
