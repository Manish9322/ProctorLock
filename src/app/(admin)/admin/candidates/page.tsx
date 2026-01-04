'use client';
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { type DataTableColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

type Candidate = {
  id: string;
  name: string;
  examId: string;
  status: 'Finished' | 'Flagged' | 'In Progress' | 'Not Started';
};

const candidates: Candidate[] = [
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

    // NOTE: This is a mock async function to simulate a server-side fetch.
    const fetchData = async (options: {
        pageIndex: number;
        pageSize: number;
        searchTerm: string;
        sort: { id: string; desc: boolean } | null;
    }) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        let filteredCandidates = candidates;

        if (options.searchTerm) {
            const term = options.searchTerm.toLowerCase();
            filteredCandidates = candidates.filter(
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
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Candidates</h1>
                <p className="text-muted-foreground">
                View and manage all registered candidates.
                </p>
            </div>
            <DataTable
                columns={columns}
                fetchData={fetchData}
                searchableColumns={['name', 'examId']}
            />
        </div>
    );
}
