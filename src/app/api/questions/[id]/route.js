'use server';
import _db from '@/lib/utils/db';
import Question from '@/models/question.model';
import { NextResponse } from 'next/server';

// GET a single question by ID
export async function GET(req, { params }) {
  try {
    await _db();
    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch question', error: error.message }, { status: 500 });
  }
}

// PUT/PATCH to update a question by ID
export async function PUT(req, { params }) {
  try {
    await _db();
    const body = await req.json();
    const updatedQuestion = await Question.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updatedQuestion) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update question', error: error.message }, { status: 400 });
  }
}

// DELETE a question by ID
export async function DELETE(req, { params }) {
    try {
        await _db();
        const deletedQuestion = await Question.findByIdAndDelete(params.id);
        if (!deletedTest) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete question', error: error.message }, { status: 500 });
    }
}
