import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { feedback as mockFeedback } from "@/lib/mockdb";

async function tryGetCollection() {
  try {
    const db = await getDb();
    return db.collection("feedback");
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const collection = await tryGetCollection();
    if (collection) {
      const result = await collection.insertOne({ name, email, message, createdAt: new Date() });
      return NextResponse.json({ ok: true, id: result.insertedId.toHexString() }, { status: 201 });
    }

    // mock fallback
    const id = Date.now().toString();
    mockFeedback.push({ id, name, email, message, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error('/api/feedback POST error:', err);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const collection = await tryGetCollection();
    if (collection) {
      const docs = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray();
      return NextResponse.json({ ok: true, feedback: docs });
    }
    return NextResponse.json({ ok: true, feedback: mockFeedback.slice().reverse() });
  } catch (err) {
    console.error('/api/feedback GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
