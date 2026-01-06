'use server';
import _db from '@/lib/utils/db';
import Candidate from '@/models/candidate.model';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';


export async function POST(req) {
    try {
        await _db();
        const body = await req.json();

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(body.password, salt);

        const newCandidate = new Candidate({
            ...body,
            password: hashedPassword,
        });
        
        await newCandidate.save();
        
        // Don't send password back
        newCandidate.password = undefined;

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
