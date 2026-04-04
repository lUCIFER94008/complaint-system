import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db-utils';

type UserBody = {
  id?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  action?: 'delete' | 'update';
};

export async function GET() {
  try {
    const { collection, mock } = await getCollection<any>('users');
    let usersList: any[] = [];

    if (collection) {
      usersList = await collection.find({}).toArray();
    } else if (mock) {
      usersList = mock;
    }

    const safe = usersList.map((u) => ({ name: u.name, email: u.email, role: u.role }));
    return NextResponse.json({ users: safe });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as UserBody;
    const { collection, mock } = await getCollection<any>('users');

    if (body.action === 'delete' && body.email) {
      if (collection) {
        await collection.deleteOne({ email: body.email });
        return NextResponse.json({ ok: true });
      } else if (mock) {
        const idx = mock.findIndex((u) => u.email === body.email);
        if (idx !== -1) {
          mock.splice(idx, 1);
          return NextResponse.json({ ok: true });
        }
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (body.action === 'update' && body.email) {
      if (collection) {
        const update: any = {};
        if (body.name !== undefined) update.name = body.name;
        if (body.role !== undefined) update.role = body.role;
        await collection.updateOne({ email: body.email }, { $set: update });
        return NextResponse.json({ ok: true });
      } else if (mock) {
        const u = mock.find((x) => x.email === body.email);
        if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        if (body.name !== undefined) u.name = body.name;
        if (body.role !== undefined) u.role = body.role;
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
