'use server';
import _db from '@/lib/utils/db';
import Question from '@/models/question.model';
import { NextResponse } from 'next/server';

// POST for bulk question creation
export async function POST(req) {
  try {
    await _db();
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json({ message: 'Request body must be a non-empty array of questions.' }, { status: 400 });
    }
    
    const result = await Question.insertMany(body, { ordered: false });
    
    return NextResponse.json({ 
        message: 'Bulk questions created successfully.',
        insertedCount: result.length
    }, { status: 201 });
  } catch (error) {
    // Mongoose validation errors can be complex, so we'll send a generic but helpful message.
    if (error.name === 'ValidationError') {
        return NextResponse.json({ message: 'One or more questions failed validation.', error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create bulk questions', error: error.message }, { status: 500 });
  }
}
