'use server';
import _db from '@/lib/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await _db();
    return NextResponse.json({ message: 'Database connected successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Database connection failed', error: error.message }, { status: 500 });
  }
}
