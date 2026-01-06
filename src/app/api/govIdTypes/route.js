'use server';
import _db from '@/lib/utils/db';
import GovIdType from '@/models/govIdType.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await _db();
    const idTypes = await GovIdType.find({}).sort({ label: 1 });
    return NextResponse.json(idTypes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch ID types', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await _db();
    const body = await req.json();
    const newIdType = new GovIdType(body);
    await newIdType.save();
    return NextResponse.json(newIdType, { status: 201 });
  } catch (error) {
     if (error.code === 11000) {
        return NextResponse.json({ message: 'This ID type already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create ID type', error: error.message }, { status: 400 });
  }
}
