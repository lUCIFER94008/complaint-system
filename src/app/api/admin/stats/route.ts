import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Complaint } from '@/models/Complaint';
import { Feedback } from '@/models/Feedback';

export async function GET() {
  try {
    await dbConnect();

    const [total, pending, inprogress, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'inprogress' }),
      Complaint.countDocuments({ status: 'resolved' }),
    ]);

    const [userCount, feedbackCount] = await Promise.all([
      User.countDocuments(),
      Feedback.countDocuments(),
    ]);

    const stats = {
      users: userCount,
      complaints: total,
      feedback: feedbackCount,
      complaintsBreakdown: { total, pending, inprogress, resolved },
    };

    return NextResponse.json({ stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Failed to gather stats' }, { status: 500 });
  }
}
