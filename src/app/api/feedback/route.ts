import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Feedback } from "@/models/Feedback";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const rating = typeof body.rating === "number" ? body.rating : undefined;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newFeedback = new Feedback({ name, email, message, rating });
    await newFeedback.save();
    return NextResponse.json({ ok: true, id: newFeedback._id }, { status: 201 });
  } catch (err) {
    console.error('/api/feedback POST error:', err);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const feedbackList = await Feedback.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ ok: true, feedback: feedbackList });
  } catch (err) {
    console.error('/api/feedback GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
