import { NextResponse } from 'next/server';
import { users } from '@/lib/mockdb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = users.find((u) => u.email === String(email));
    if (!user || user.password !== String(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // For demo purposes we return role and email — do NOT ship like this in production.
    return NextResponse.json({ email: user.email, role: user.role });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
