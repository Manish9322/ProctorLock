'use server';
import _db from '@/lib/utils/db';
import College from '@/models/college.model';
import { NextResponse } from 'next/server';

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
