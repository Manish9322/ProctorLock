'use server';
import _db from '@/lib/utils/db';
import Candidate from '@/models/candidate.model';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MONGODB_URI } from '@/config/config';

export async function POST(req) {
    try {
        await _db();
        const { email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json({ message: "Email, password, and role are required." }, { status: 400 });
        }

        const user = await Candidate.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials. User not found.' }, { status: 401 });
        }

        // Check if the role matches
        if (user.role !== role) {
             return NextResponse.json({ message: `You are not registered as a(n) ${role}.` }, { status: 403 });
        }

        // Check if user is approved (especially for 'examiner')
        if (user.role === 'examiner') {
            if (user.approvalStatus === 'Pending') {
                return NextResponse.json({ message: 'Your account is pending approval by an administrator.' }, { status: 403 });
            }
            if (user.approvalStatus === 'Rejected') {
                return NextResponse.json({ message: 'Your account registration was rejected. Please contact support.' }, { status: 403 });
            }
        }
        
        const isMatch = await bcryptjs.compare(password, user.password);
        
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials. Password incorrect.' }, { status: 401 });
        }
        
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        return NextResponse.json({
            message: 'Login successful',
            token: token
        }, { status: 200 });

    } catch (error) {
        console.error("Login API Error: ", error);
        return NextResponse.json({ message: 'An internal server error occurred.', error: error.message }, { status: 500 });
    }
}
