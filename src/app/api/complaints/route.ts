import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { complaints as mockComplaints } from "@/lib/mockdb";

type CreateComplaintBody = {
  title?: string;
  description?: string;
  name?: string;
  email?: string;
  message?: string;
};

async function tryGetCollection() {
  try {
    const db = await getDb();
    return db.collection("complaints");
  } catch (err) {
    // Fallback to mock in-memory collection when MongoDB isn't configured
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateComplaintBody;

    const collection = await tryGetCollection();

    // If client posted title/description (in-app flow)
    if (typeof body.title === "string" && typeof body.description === "string") {
      const title = body.title.trim();
      const description = body.description.trim();
      if (!title || !description) {
        return NextResponse.json({ error: "Title and description required" }, { status: 400 });
      }

      if (collection) {
        const result = await collection.insertOne({ title, description, status: "pending", createdAt: new Date() });
        return NextResponse.json({ ok: true, id: result.insertedId.toHexString() }, { status: 201 });
      }

      // mock fallback
      const id = Date.now().toString();
      mockComplaints.push({ id, title, description, status: "pending", createdAt: new Date().toISOString() });
      return NextResponse.json({ ok: true, id }, { status: 201 });
    }

    // Otherwise support name/email/message shape
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields for contact complaint" }, { status: 400 });
    }

    if (collection) {
      const result = await collection.insertOne({ name, email, message, status: "pending", createdAt: new Date() });
      return NextResponse.json({ ok: true, id: result.insertedId.toHexString() }, { status: 201 });
    }

    // mock fallback
    const id = Date.now().toString();
    mockComplaints.push({ id, name, email, message, status: "pending", createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("/api/complaints POST error:", err);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitRaw = url.searchParams.get("limit") ?? "50";
  const limit = Math.max(1, Math.min(100, Number(limitRaw) || 50));

  try {
    const collection = await tryGetCollection();

    if (collection) {
      const docs = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      const mapped = docs.map((doc) => {
        const { _id, ...rest } = doc as any;
        return {
          id: _id.toHexString(),
          ...rest,
        };
      });

      return NextResponse.json({ ok: true, complaints: mapped });
    }

    // mock fallback
    const mapped = mockComplaints.slice(-limit).reverse().map((c) => ({ id: c.id, ...c }));
    return NextResponse.json({ ok: true, complaints: mapped });
  } catch (err) {
    console.error('/api/complaints GET error:', err);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body || {};
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

    const collection = await tryGetCollection();
    if (collection) {
      try {
        const res = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
        if (res.matchedCount === 0) return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
        return NextResponse.json({ ok: true });
      } catch (err) {
        // maybe id is not a valid ObjectId; fallthrough to mock
      }
    }

    // mock fallback: find by id string
    const idx = mockComplaints.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    mockComplaints[idx].status = status;
    mockComplaints[idx].updatedAt = new Date().toISOString();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('/api/complaints PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
  }
}

