'use server';
import _db from '@/lib/utils/db';
import Test from '@/models/test.model';
import { NextResponse } from 'next/server';

// GET a single test by ID
export async function GET(req, { params }) {
  try {
    await _db();
    const test = await Test.findById(params.id);
    if (!test) {
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }
    return NextResponse.json(test, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch test', error: error.message }, { status: 500 });
  }
}

// PUT/PATCH to update a test by ID
export async function PUT(req, { params }) {
  try {
    await _db();
    const body = await req.json();
    const updatedTest = await Test.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updatedTest) {
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTest, { status: 200 });
  } catch (error) {
     if (error.code === 11000) {
        return NextResponse.json({ message: 'A test with this title already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to update test', error: error.message }, { status: 500 });
  }
}

// DELETE a test by ID
export async function DELETE(req, { params }) {
    try {
        await _db();
        const deletedTest = await Test.findByIdAndDelete(params.id);
        if (!deletedTest) {
            return NextResponse.json({ message: 'Test not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Test deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete test', error: error.message }, { status: 500 });
    }
}
