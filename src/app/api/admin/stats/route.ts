import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db-utils';

export async function GET() {
  try {
    const { collection: cColl, mock: cMock } = await getCollection<any>('complaints');
    const { collection: uColl, mock: uMock } = await getCollection<any>('users');
    const { collection: fColl, mock: fMock } = await getCollection<any>('feedback');

    let total = 0, pending = 0, inprogress = 0, resolved = 0;
    let userCount = 0, feedbackCount = 0;

    if (cColl) {
      total = await cColl.countDocuments();
      pending = await cColl.countDocuments({ status: 'pending' });
      inprogress = await cColl.countDocuments({ status: 'inprogress' });
      resolved = await cColl.countDocuments({ status: 'resolved' });
    } else if (cMock) {
      total = cMock.length;
      pending = cMock.filter((c) => c.status === 'pending').length;
      inprogress = cMock.filter((c) => c.status === 'inprogress').length;
      resolved = cMock.filter((c) => c.status === 'resolved').length;
    }

    if (uColl) userCount = await uColl.countDocuments();
    else if (uMock) userCount = uMock.length;

    if (fColl) feedbackCount = await fColl.countDocuments();
    else if (fMock) feedbackCount = fMock.length;

    const stats = {
      users: userCount,
      complaints: total,
      feedback: feedbackCount,
      complaintsBreakdown: { total, pending, inprogress, resolved },
    };

    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to gather stats' }, { status: 500 });
  }
}
