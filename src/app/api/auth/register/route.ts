import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

const ADMIN_CREATE_CODE = process.env.ADMIN_CREATE_CODE || 'ADMIN_SECRET';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role, adminCode } = body || {};

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
    }

    if (role === 'admin' && adminCode !== ADMIN_CREATE_CODE) {
      return NextResponse.json({ error: 'Invalid admin code.' }, { status: 403 });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const newUser = new User({
      name: String(name),
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
    });

    await newUser.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Registration error:', err);
    // Provide a more helpful error message for debugging
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ 
      error: `Failed to register: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    }, { status: 500 });
  }
}
