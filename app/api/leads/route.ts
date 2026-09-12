import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/lead-schema";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { isRateLimited } from "@/lib/rate-limit";
import { appendLead, type LeadRow } from "@/lib/sheets";
import { sendInternalLeadAlert, sendVisitorConfirmation } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (isDisposableEmail(data.email)) {
      return NextResponse.json(
        { error: "Please use a real work or personal email." },
        { status: 400 },
      );
    }

    if (await isRateLimited(data.email)) {
      return NextResponse.json(
        { error: "You already submitted recently. Please wait a few minutes." },
        { status: 429 },
      );
    }

    const urgency = data.timeline === "ASAP" ? "Hot" : "Normal";
    const lead: LeadRow = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      build_type: data.buildType,
      notes: data.notes ?? "",
      project_name: data.projectName,
      stage: data.stage,
      timeline: data.timeline,
      urgency,
      call_booked: "false",
      call_start: "",
      call_end: "",
      utm_source: data.utm_source ?? "",
      utm_campaign: data.utm_campaign ?? "",
      utm_medium: data.utm_medium ?? "",
      referrer: data.referrer ?? "",
      page: data.page ?? "",
      ad_campaign: data.ad_campaign ?? "",
      status: "form_submitted",
    };

    await appendLead(lead);

    try {
      await Promise.all([
        sendVisitorConfirmation(lead),
        sendInternalLeadAlert(lead),
      ]);
    } catch (emailError) {
      console.error("Lead saved but email failed:", emailError);
    }

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error("POST /api/leads failed:", error);
    const message =
      error instanceof Error ? error.message : "Unable to save lead";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
