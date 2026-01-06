'use server';
import _db from '@/lib/utils/db';
import GovIdType from '@/models/govIdType.model';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
    try {
        await _db();
        const deletedIdType = await GovIdType.findByIdAndDelete(params.id);
        if (!deletedIdType) {
            return NextResponse.json({ message: 'ID type not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'ID type deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete ID type', error: error.message }, { status: 500 });
    }
}
