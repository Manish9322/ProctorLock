'use client';
import React from 'react';
import { DataTable, type DataTableColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Test = {
    id: string;
    title: string;
    candidates: number;
    status: 'Active' | 'Finished' | 'Draft';
};

const tests: Test[] = [
  { id: 'CS101-FINAL', title: 'Intro to CS - Final', candidates: 150, status: 'Active' },
  { id: 'MA203-MIDTERM', title: 'Calculus II - Midterm', candidates: 88, status: 'Active' },
  { id: 'PHY201-QUIZ3', title: 'University Physics I - Quiz 3', candidates: 120, status: 'Finished' },
  { id: 'CHEM101-FINAL', title: 'General Chemistry - Final', candidates: 0, status: 'Draft' },
  { id: 'HIST202-PAPER', title: 'American History II - Paper', candidates: 75, status: 'Active' },
  { id: 'PSYCH-301', title: 'Abnormal Psychology - Midterm', candidates: 95, status: 'Finished' },
  { id: 'ECO101-QUIZ', title: 'Principles of Microeconomics - Quiz 1', candidates: 200, status: 'Active' },
  { id: 'ART-HISTORY', title: 'Art History - Final Project', candidates: 40, status: 'Draft' },
];

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
    id: 'actions',
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

export default function TestsPage() {
  
    // NOTE: This is a mock async function to simulate a server-side fetch.
    const fetchData = async (options: {
        pageIndex: number;
        pageSize: number;
        searchTerm: string;
        sort: { id: string; desc: boolean } | null;
    }) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        let filteredTests = tests;

        if (options.searchTerm) {
            const term = options.searchTerm.toLowerCase();
            filteredTests = tests.filter(
                (test) =>
                test.id.toLowerCase().includes(term) ||
                test.title.toLowerCase().includes(term)
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
    };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tests</h1>
          <p className="text-muted-foreground">
            Create, manage, and view results for all your tests.
          </p>
        </div>
        <Button>Create New Test</Button>
      </div>
      <DataTable
        columns={columns}
        fetchData={fetchData}
        searchableColumns={['id', 'title']}
      />
    </div>
  );
}
