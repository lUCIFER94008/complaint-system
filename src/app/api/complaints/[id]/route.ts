import { NextResponse } from "next/server";
import { complaints } from "@/lib/mockdb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { status } = body || {};
    const idx = complaints.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 });
    complaints[idx].status = status;
    return NextResponse.json({ ok: true, complaint: complaints[idx] });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const idx = complaints.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  complaints.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
