'use server';
import _db from '@/lib/utils/db';
import Assignment from '@/models/assignment.model';
import { NextResponse } from 'next/server';

// GET assignments for a specific test
export async function GET(req, { params }) {
  try {
    await _db();
    const testId = params.testId;
    const assignments = await Assignment.find({ test: testId }).populate('candidate', 'name email');
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch assignments', error: error.message }, { status: 500 });
  }
}

// DELETE a specific assignment by its own ID (not testId)
export async function DELETE(req, { params }) {
    try {
        await _db();
        const assignmentId = params.testId; // This param is now the assignment ID
        const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);
        if (!deletedAssignment) {
            return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete assignment', error: error.message }, { status: 500 });
    }
}