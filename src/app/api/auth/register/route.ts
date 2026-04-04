import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db-utils';

// Allow configuring admin creation code via environment variable
const ADMIN_CREATE_CODE = process.env.ADMIN_CREATE_CODE || 'ADMIN_SECRET';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, adminCode } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (role === 'admin' && adminCode !== ADMIN_CREATE_CODE) {
      return NextResponse.json({ error: 'Invalid admin code.' }, { status: 403 });
    }

    const { collection, mock } = await getCollection<any>('users');

    if (collection) {
      const exists = await collection.findOne({ email: String(email) });
      if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      await collection.insertOne({
        name: String(name || ''),
        email: String(email),
        password: String(password),
        role: role === 'admin' ? 'admin' : 'user',
        createdAt: new Date()
      });
      return NextResponse.json({ ok: true });
    }

    if (mock) {
      const exists = mock.find((u) => u.email === String(email));
      if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      mock.push({ name: String(name || ''), email: String(email), password: String(password), role: role === 'admin' ? 'admin' : 'user' });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
