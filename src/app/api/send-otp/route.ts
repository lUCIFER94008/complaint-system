import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { OTP } from "@/models/OTP";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    await dbConnect();

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiration: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save or update OTP for this email
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    // Send Email
    try {
      await sendEmail(
        email,
        "Your Verification Code",
        `Your verification code is: ${otpCode}. It is valid for 5 minutes.`
      );
      console.log(`OTP [${otpCode}] sent to email [${email}]`);
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
      return NextResponse.json({ error: "Failed to send OTP email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "OTP sent successfully to your email." });
  } catch (err) {
    console.error("Send-OTP error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
