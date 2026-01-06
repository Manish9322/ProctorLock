'use server';
import _db from '@/lib/utils/db';
import Role from '@/models/role.model';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
    try {
        await _db();
        const deletedRole = await Role.findByIdAndDelete(params.id);
        if (!deletedRole) {
            return NextResponse.json({ message: 'Role not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete role', error: error.message }, { status: 500 });
    }
}
