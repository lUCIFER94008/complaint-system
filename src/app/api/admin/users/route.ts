import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    const safe = users.map((u) => ({ name: u.name, email: u.email, role: u.role }));
    return NextResponse.json({ users: safe });
  } catch (err) {
    console.error('Admin user list error:', err);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, role, action } = body || {};

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await dbConnect();

    if (action === 'delete') {
      const result = await User.deleteOne({ email });
      if (result.deletedCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'update') {
      const update: any = {};
      if (name !== undefined) update.name = name;
      if (role !== undefined) update.role = role;
      
      const result = await User.updateOne({ email }, { $set: update });
      if (result.matchedCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Admin user action error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
