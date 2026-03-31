import { NextResponse } from 'next/server';
import { users } from '@/lib/mockdb';

type UserBody = {
  id?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  action?: 'delete' | 'update';
};

export async function GET() {
  try {
    // Return shallow copy of users (no passwords)
    const safe = users.map((u) => ({ name: u.name, email: u.email, role: u.role }));
    return NextResponse.json({ users: safe });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as UserBody;
    if (body.action === 'delete' && body.email) {
      const idx = users.findIndex((u) => u.email === body.email);
      if (idx !== -1) {
        users.splice(idx, 1);
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (body.action === 'update' && body.email) {
      const u = users.find((x) => x.email === body.email);
      if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      if (body.name !== undefined) u.name = body.name;
      if (body.role !== undefined) u.role = body.role;
      return NextResponse.json({ ok: true, user: { name: u.name, email: u.email, role: u.role } });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to modify users' }, { status: 500 });
  }
}
