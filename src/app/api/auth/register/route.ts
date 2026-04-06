import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { OTP } from '@/models/OTP';
import bcrypt from 'bcryptjs';
import { sendSMS } from '@/lib/sms';

const ADMIN_CREATE_CODE = process.env.ADMIN_CREATE_CODE || 'ADMIN_SECRET';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, phone, role, adminCode, otp } = await req.json();

    if (!email || !password || !name || !phone || !otp) {
       return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (role === 'admin' && adminCode !== ADMIN_CREATE_CODE) {
      return NextResponse.json({ error: 'Invalid admin code.' }, { status: 403 });
    }

    // Checking if user already exists
    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // --- OTP VERIFICATION (VIA EMAIL) ---
    const existingOTP = await OTP.findOne({ 
      email: String(email).toLowerCase().trim() 
    }).sort({ createdAt: -1 });

    if (!existingOTP) {
      return NextResponse.json({ error: "OTP not found" }, { status: 400 });
    }

    if (existingOTP.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (existingOTP.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }
    // ------------------------

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name: String(name),
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      phone: String(phone || ""),
    });

    await OTP.deleteMany({ email: String(email).toLowerCase().trim() });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
