'use server';
import _db from '@/lib/utils/db';
import Candidate from '@/models/candidate.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await _db();
        const body = await req.json();

        // In a real app, hash the password before saving
        // For now, we'll save it as is for demonstration
        
        const newCandidate = new Candidate(body);
        await newCandidate.save();
        return NextResponse.json(newCandidate, { status: 201 });
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate email error
            return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
        }
        if (error.name === 'ValidationError') {
            return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to register user', error: error.message }, { status: 500 });
    }
}
