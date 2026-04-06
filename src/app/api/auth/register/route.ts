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
    const body = await req.json();
    const { name, email, password, phone, role, adminCode, otp } = body || {};

    if (!email || !password || !name || !phone || !otp) {
      return NextResponse.json({ error: 'Name, email, password, phone and OTP are required' }, { status: 400 });
    }

    if (role === 'admin' && adminCode !== ADMIN_CREATE_CODE) {
      return NextResponse.json({ error: 'Invalid admin code.' }, { status: 403 });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // --- OTP VERIFICATION ---
    const otpRecord = await OTP.findOne({ phone, otp });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP or phone number' }, { status: 400 });
    }

    // Check if expired (though TTL index handles this, we do a manual check for safety)
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }
    // ------------------------

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const newUser = new User({
      name: String(name),
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      phone: String(phone || ""),
    });

    await newUser.save();

    // Delete OTP after successful use
    await OTP.deleteMany({ phone });

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
