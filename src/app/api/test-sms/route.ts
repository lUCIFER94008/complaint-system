import { sendSMS } from "@/lib/sms";

export async function GET() {
  try {
    // You can replace this with your own number for testing
    // or keep it as a placeholder as requested.
    await sendSMS("+91XXXXXXXXXX", "Test SMS working 🚀");
    return Response.json({ ok: true, message: "Test SMS sent" });
  } catch (error) {
    console.error("SMS test error:", error);
    return Response.json({ ok: false, error: "Failed to send SMS" }, { status: 500 });
  }
}
