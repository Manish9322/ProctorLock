'use server';
import _db from '@/lib/utils/db';
import Assignment from '@/models/assignment.model';
import { NextResponse } from 'next/server';

// GET assignments for a specific candidate
export async function GET(req, { params }) {
  try {
    await _db();
    const { candidateId } = params;
    if (!candidateId) {
        return NextResponse.json({ message: 'Candidate ID is required' }, { status: 400 });
    }

    const assignments = await Assignment.find({ candidate: candidateId }).populate({
        path: 'test',
        model: 'Test'
    });
    
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch assignments for candidate', error: error.message }, { status: 500 });
  }
}
