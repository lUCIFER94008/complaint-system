import { NextResponse } from 'next/server';
import { users, complaints, feedback } from '@/lib/mockdb';

export async function GET(req: Request) {
  try {
    // For demo, we don't enforce auth on server but the client will show restricted view if not admin.
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inprogress = complaints.filter((c) => c.status === 'inprogress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;

    const stats = {
      users: users.length,
      complaints: total,
      feedback: feedback.length,
      complaintsBreakdown: { total, pending, inprogress, resolved },
    };

    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to gather stats' }, { status: 500 });
  }
}
