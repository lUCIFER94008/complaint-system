import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db-utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { collection, mock } = await getCollection<any>('users');

    let user: any = null;
    if (collection) {
      user = await collection.findOne({ email: String(email) });
    } else if (mock) {
      user = mock.find((u) => u.email === String(email));
    }

    if (!user || user.password !== String(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // For demo purposes we return role, email and name
    return NextResponse.json({ email: user.email, role: user.role, name: user.name });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
