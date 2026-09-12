import { NextResponse } from "next/server";
import { bookedSchema } from "@/lib/lead-schema";
import { updateLeadBooking } from "@/lib/sheets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const lead = await updateLeadBooking(parsed.data.id, {
      call_start: parsed.data.call_start,
      call_end: parsed.data.call_end,
    });

    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    console.error("POST /api/leads/booked failed:", error);
    const message =
      error instanceof Error ? error.message : "Unable to update booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
