'use server';
import _db from '@/lib/utils/db';
import Assignment from '@/models/assignment.model';
import { NextResponse } from 'next/server';

// POST a new assignment
export async function POST(req) {
  try {
    await _db();
    const body = await req.json();
    
    // Check for test and candidate IDs
    if (!body.test || !body.candidate) {
        return NextResponse.json({ message: 'Test ID and Candidate ID are required.' }, { status: 400 });
    }

    const newAssignment = new Assignment({
        test: body.test,
        candidate: body.candidate,
    });
    await newAssignment.save();
    
    // Populate candidate details before sending back
    await newAssignment.populate('candidate', 'name email');

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate key error for the unique index
        return NextResponse.json({ message: 'This candidate is already assigned to this test.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create assignment', error: error.message }, { status: 400 });
  }
}

    