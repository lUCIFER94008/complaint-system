import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import dbConnect from "@/lib/mongodb";
import { Complaint } from "@/models/Complaint";

// ==========================
// POST – create complaint + send email
// ==========================
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // ==========================
    // 1. In-app complaint (title + description)
    // ==========================
    if (typeof body.title === "string" && typeof body.description === "string") {
      const title = body.title.trim();
      const description = body.description.trim();

      if (!title || !description) {
        return NextResponse.json(
          { error: "Title and description required" },
          { status: 400 }
        );
      }

      const newComplaint = new Complaint({
        title,
        description,
        email: body.email || null, // optional email
        status: "pending",
      });

      await newComplaint.save();

      // ✅ SEND EMAIL (if email exists)
      if (body.email) {
        try {
          await sendEmail(
            body.email,
            "Complaint Submitted ✅",
            `Your complaint "${title}" has been successfully submitted.\n\nWe will review it shortly.`
          );
        } catch (e) {
          console.error("Email error (POST):", e);
        }
      }

      return NextResponse.json(
        { ok: true, id: newComplaint._id },
        { status: 201 }
      );
    }

    // ==========================
    // 2. Contact complaint (name, email, message)
    // ==========================
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const newContactComplaint = new Complaint({
      name,
      email,
      message,
      status: "pending",
    });

    await newContactComplaint.save();

    // ✅ SEND EMAIL
    try {
      await sendEmail(
        email,
        "Complaint Received 📩",
        `Hi ${name},\n\nYour complaint has been received successfully.\n\nWe will get back to you soon.\n\nThank you.`
      );
    } catch (e) {
      console.error("Email error (POST contact):", e);
    }

    return NextResponse.json(
      { ok: true, id: newContactComplaint._id },
      { status: 201 }
    );

  } catch (err) {
    console.error("/api/complaints POST error:", err);
    return NextResponse.json(
      { error: "Failed to create" },
      { status: 500 }
    );
  }
}

// ==========================
// GET – fetch complaints
// ==========================
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitRaw = url.searchParams.get("limit") ?? "50";
  const limit = Math.max(1, Math.min(100, Number(limitRaw) || 50));

  try {
    await dbConnect();

    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .limit(limit);

    const mapped = complaints.map((doc) => ({
      id: doc._id.toHexString(),
      title: doc.title,
      description: doc.description,
      name: doc.name,
      email: doc.email,
      message: doc.message,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json({ ok: true, complaints: mapped });

  } catch (err) {
    console.error("/api/complaints GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

// ==========================
// PATCH – update status + send email
// ==========================
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updated = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // ✅ SEND STATUS UPDATE EMAIL
    if (updated.email) {
      try {
        await sendEmail(
          updated.email,
          "Complaint Status Updated 🔔",
          `Your complaint "${updated.title || "your complaint"
          }" status has been updated to "${status}".`
        );
      } catch (e) {
        console.error("Email error (PATCH):", e);
      }
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("/api/complaints PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}