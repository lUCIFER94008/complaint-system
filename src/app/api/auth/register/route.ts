import { NextResponse } from 'next/server';
import { users } from '@/lib/mockdb';

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
      return NextResponse.json({ error: 'Invalid admin code. Please set the correct code in ADMIN_CREATE_CODE environment variable.' }, { status: 403 });
    }

    const exists = users.find((u) => u.email === String(email));
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    users.push({ name: String(name || ''), email: String(email), password: String(password), role: role === 'admin' ? 'admin' : 'user' });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
