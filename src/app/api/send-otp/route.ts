import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { OTP } from "@/models/OTP";
import { sendSMS } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    // Basic phone validation (you can improve this with a library like libphonenumber-js)
    if (!phone.startsWith("+") || phone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number format. Use international format (e.g., +91XXXXXXXXXX)." }, { status: 400 });
    }

    await dbConnect();

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiration: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save or update OTP for this phone
    // We update if it already exists to avoid multiple active OTPs for the same phone
    await OTP.findOneAndUpdate(
      { phone },
      { otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    // Send SMS via Twilio
    try {
      await sendSMS(phone, `Your verification code is: ${otpCode}. Valid for 5 minutes.`);
      console.log(`OTP [${otpCode}] sent to [${phone}]`);
    } catch (smsErr) {
      console.error("Twilio SMS send error:", smsErr);
      return NextResponse.json({ error: "Failed to send SMS. Please check your phone number or try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "OTP sent successfully." });
  } catch (err) {
    console.error("Send-OTP error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
