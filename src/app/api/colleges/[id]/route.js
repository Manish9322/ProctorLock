'use server';
import _db from '@/lib/utils/db';
import College from '@/models/college.model';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        await _db();
        const body = await req.json();
        const updatedCollege = await College.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedCollege) {
            return NextResponse.json({ message: 'College not found' }, { status: 404 });
        }
        return NextResponse.json(updatedCollege, { status: 200 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'A college with this name already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to update college', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await _db();
        const deletedCollege = await College.findByIdAndDelete(params.id);
        if (!deletedCollege) {
            return NextResponse.json({ message: 'College not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'College deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete college', error: error.message }, { status: 500 });
    }
}
