import { NextResponse } from "next/server";
import { sendEmail } from '@/lib/mailer';
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db-utils";

// Types for request bodies
type CreateComplaintBody = {
  title?: string;
  description?: string;
  name?: string;
  email?: string;
  message?: string;
};

// POST – create a new complaint
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateComplaintBody;
    const { collection, mock } = await getCollection<any>('complaints');

    // In‑app flow: title & description
    if (typeof body.title === "string" && typeof body.description === "string") {
      const title = body.title.trim();
      const description = body.description.trim();
      if (!title || !description) return NextResponse.json({ error: "Title and description required" }, { status: 400 });

      if (collection) {
        const result = await collection.insertOne({ title, description, status: "pending", createdAt: new Date() });
        return NextResponse.json({ ok: true, id: result.insertedId.toHexString() }, { status: 201 });
      }
      if (mock) {
        const id = Date.now().toString();
        mock.push({ id, title, description, status: "pending", createdAt: new Date().toISOString() } as any);
        return NextResponse.json({ ok: true, id }, { status: 201 });
      }
    }

    // Contact‑type complaint: name, email, message
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    if (collection) {
      const result = await collection.insertOne({ name, email, message, status: "pending", createdAt: new Date() });
      return NextResponse.json({ ok: true, id: result.insertedId.toHexString() }, { status: 201 });
    }
    if (mock) {
      const id = Date.now().toString();
      mock.push({ id, name, email, message, status: "pending", createdAt: new Date().toISOString() } as any);
      return NextResponse.json({ ok: true, id }, { status: 201 });
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  } catch (err) {
    console.error("/api/complaints POST error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// GET – fetch complaints
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitRaw = url.searchParams.get("limit") ?? "50";
  const limit = Math.max(1, Math.min(100, Number(limitRaw) || 50));

  try {
    const { collection, mock } = await getCollection<any>('complaints');
    if (collection) {
      const docs = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
      const mapped = docs.map((doc) => {
        const { _id, ...rest } = doc as any;
        return { id: _id.toHexString(), ...rest };
      });
      return NextResponse.json({ ok: true, complaints: mapped });
    }
    if (mock) {
      const mapped = mock.slice(-limit).reverse().map((c) => ({ id: (c as any).id, ...c }));
      return NextResponse.json({ ok: true, complaints: mapped });
    }
    return NextResponse.json({ ok: true, complaints: [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PATCH – update complaint status and send email notification
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

    const { collection, mock } = await getCollection<any>('complaints');

    if (collection) {
      const res = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
      if (res.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

      // Send email
      try {
        const updated = await collection.findOne({ _id: new ObjectId(id) });
        if (updated && (updated as any).email) {
          await sendEmail((updated as any).email, "Complaint Status Update", `Your complaint "${(updated as any).title || "your complaint"}" status has been updated to "${status}".`);
        }
      } catch (e) { console.error("Email error:", e); }
      return NextResponse.json({ ok: true });
    }

    if (mock) {
      const idx = mock.findIndex((c) => (c as any).id === id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      (mock[idx] as any).status = status;
      (mock[idx] as any).updatedAt = new Date().toISOString();

      const item = mock[idx] as any;
      if (item.email) {
        try { await sendEmail(item.email, "Complaint Status Update", `Your complaint "${item.title || "your complaint"}" status has been updated to "${status}".`); }
        catch (e) { console.error("Mock email error:", e); }
      }
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
