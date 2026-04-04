import { NextResponse } from "next/server";
import { sendEmail } from '@/lib/mailer';
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { complaints as mockComplaints } from "@/lib/mockdb";

// Types for request bodies
type CreateComplaintBody = {
  title?: string;
  description?: string;
  name?: string;
  email?: string;
  message?: string;
};

// Helper to get MongoDB collection or fallback to mock
async function tryGetCollection() {
  try {
    const db = await getDb();
    return db.collection("complaints");
  } catch {
    // Fallback when MongoDB is not configured
    return null;
  }
}

// POST – create a new complaint
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateComplaintBody;
    const collection = await tryGetCollection();

    // In‑app flow: title & description
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

    // Contact‑type complaint: name, email, message
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

// GET – fetch complaints
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitRaw = url.searchParams.get("limit") ?? "50";
  const limit = Math.max(1, Math.min(100, Number(limitRaw) || 50));

  try {
    const collection = await tryGetCollection();
    if (collection) {
      const docs = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
      const mapped = docs.map((doc) => {
        const { _id, ...rest } = doc as any;
        return { id: _id.toHexString(), ...rest };
      });
      return NextResponse.json({ ok: true, complaints: mapped });
    }
    // mock fallback
    const mapped = mockComplaints.slice(-limit).reverse().map((c) => ({ id: c.id, ...c }));
    return NextResponse.json({ ok: true, complaints: mapped });
  } catch (err) {
    console.error("/api/complaints GET error:", err);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

// PATCH – update complaint status and send email notification
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

    const collection = await tryGetCollection();

    // Real MongoDB path
    if (collection) {
      const res = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
      if (res.matchedCount === 0) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });

      // Send email if the complaint document contains an email field
      try {
        const updated = await collection.findOne({ _id: new ObjectId(id) });
        if (updated && (updated as any).email) {
          await sendEmail(
            (updated as any).email,
            "Complaint Status Update",
            `Your complaint "${(updated as any).title || "your complaint"}" status has been updated to "${status}". Thank you for your patience.`
          );
        }
      } catch (e) {
        console.error("Error sending status email:", e);
      }
      return NextResponse.json({ ok: true });
    }

    // Mock fallback path
    const idx = mockComplaints.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    mockComplaints[idx].status = status;
    mockComplaints[idx].updatedAt = new Date().toISOString();

    // Send email for mock data if email present
    const mock = mockComplaints[idx] as any;
    if (mock.email) {
      try {
        await sendEmail(
          mock.email,
          "Complaint Status Update",
          `Your complaint "${mock.title || "your complaint"}" status has been updated to "${status}". Thank you for your patience.`
        );
      } catch (e) {
        console.error("Error sending mock email:", e);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/complaints PATCH error:", err);
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}
