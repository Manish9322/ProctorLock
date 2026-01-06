'use server';
import _db from '@/lib/utils/db';
import Question from '@/models/question.model';
import { NextResponse } from 'next/server';

// GET all questions
export async function GET() {
  try {
    await _db();
    const questions = await Question.find({}).sort({ createdAt: -1 });
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch questions', error: error.message }, { status: 500 });
  }
}

// POST a new question
export async function POST(req) {
  try {
    await _db();
    const body = await req.json();
    
    const newQuestion = new Question(body);
    await newQuestion.save();
    
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create question', error: error.message }, { status: 400 });
  }
}
