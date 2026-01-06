'use server';
import _db from '@/lib/utils/db';
import College from '@/models/college.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await _db();
    const colleges = await College.find({}).sort({ name: 1 });
    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch colleges', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await _db();
    const body = await req.json();
    const newCollege = new College(body);
    await newCollege.save();
    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
     if (error.code === 11000) {
        return NextResponse.json({ message: 'This college already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create college', error: error.message }, { status: 400 });
  }
}
