import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Complaint } from "@/models/Complaint";
import { sendSMS } from "@/lib/sms";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 });

    await dbConnect();
    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Send SMS notification if status is resolved and phone is available
    if (status === 'resolved' && updated.phone) {
      try {
        await sendSMS(
          updated.phone,
          `Your complaint "${updated.title}" is RESOLVED ✅`
        );
      } catch (smsErr) {
        console.error('Failed to send resolution SMS:', smsErr);
      }
    }

    return NextResponse.json({ ok: true, complaint: updated });
  } catch (err) {
    console.error('Complaint PATCH error:', err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const result = await Complaint.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Complaint DELETE error:', err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
