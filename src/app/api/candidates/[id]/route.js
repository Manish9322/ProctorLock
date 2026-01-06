'use server';
import _db from '@/lib/utils/db';
import Candidate from '@/models/candidate.model';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    await _db();
    const body = await req.json();
    const updatedCandidate = await Candidate.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updatedCandidate) {
      return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    }
    return NextResponse.json(updatedCandidate, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update candidate', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
    try {
        await _db();
        const deletedCandidate = await Candidate.findByIdAndDelete(params.id);
        if (!deletedCandidate) {
            return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Candidate deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete candidate', error: error.message }, { status: 500 });
    }
}
