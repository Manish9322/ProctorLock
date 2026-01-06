'use server';
import _db from '@/lib/utils/db';
import Role from '@/models/role.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await _db();
    const roles = await Role.find({}).sort({ label: 1 });
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch roles', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await _db();
    const body = await req.json();
    const newRole = new Role(body);
    await newRole.save();
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ message: 'This role already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create role', error: error.message }, { status: 400 });
  }
}
