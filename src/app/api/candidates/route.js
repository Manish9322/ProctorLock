'use server';
import _db from '@/lib/utils/db';
import Candidate from '@/models/candidate.model';
import { NextResponse } from 'next/server';

// GET all candidates
export async function GET() {
  try {
    await _db();
    const candidates = await Candidate.find({}).sort({ name: 1 });
    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch candidates', error: error.message }, { status: 500 });
  }
}

// In a real app, you'd have a POST to create candidates from the registration page
export async function POST(req) {
    try {
        await _db();
        const body = await req.json();
        const newCandidate = new Candidate(body);
        await newCandidate.save();
        return NextResponse.json(newCandidate, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'A candidate with this email already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to create candidate', error: error.message }, { status: 400 });
    }
}

    