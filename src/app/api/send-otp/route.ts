import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import OTP from "@/models/OTP";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    // 🔍 DEBUG ENV VARIABLES
    console.log("ENV CHECK:", {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? "OK" : "MISSING",
    });

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP:", otp);

    // 💾 Save OTP in DB
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    console.log("OTP saved to DB");

    // 📧 Send Email
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is ${otp}`
    );

    console.log("Email sent successfully");

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send OTP email" },
      { status: 500 }
    );
  }
}