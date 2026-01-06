'use server';
import _db from '@/lib/utils/db';
import Test from '@/models/test.model';
import { NextResponse } from 'next/server';

// GET all tests
export async function GET() {
  try {
    await _db();
    const tests = await Test.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch tests', error: error.message }, { status: 500 });
  }
}

// POST a new test
export async function POST(req) {
  try {
    await _db();
    const body = await req.json();
    
    const newTest = new Test(body);
    await newTest.save();
    
    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate key error
        return NextResponse.json({ message: 'A test with this title already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create test', error: error.message }, { status: 500 });
  }
}
