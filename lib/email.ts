import { Resend } from "resend";
import type { LeadRow } from "./sheets";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM ?? "Nexode AI <onboarding@resend.dev>";
}

export async function sendVisitorConfirmation(lead: LeadRow) {
  const resend = getResend();
  const booked = lead.call_booked === "true";

  await resend.emails.send({
    from: fromAddress(),
    to: lead.email,
    subject: booked
      ? "You're in — your call is confirmed"
      : "You're in — we got your project brief",
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0B0E17">
        <h1 style="font-size:20px">Thanks, ${escapeHtml(lead.name)}.</h1>
        <p>We received your note at Nexode AI.</p>
        <ul>
          <li><strong>Looking to build:</strong> ${escapeHtml(lead.build_type || "—")}</li>
          <li><strong>Project:</strong> ${escapeHtml(lead.project_name || "—")}</li>
          <li><strong>Stage:</strong> ${escapeHtml(lead.stage || "—")}</li>
          <li><strong>Timeline:</strong> ${escapeHtml(lead.timeline || "—")}</li>
        </ul>
        ${
          booked
            ? "<p>Your call is booked — Calendly will send the invite and reminders.</p>"
            : "<p>Next step: book a call if you haven't yet, or reply to this email with anything we should know.</p>"
        }
        <p style="color:#6b7280;font-size:14px">— Nexode AI</p>
      </div>
    `,
  });
}

export async function sendInternalLeadAlert(lead: LeadRow) {
  const notify = process.env.LEADS_NOTIFY_EMAIL;
  if (!notify) return;

  const resend = getResend();
  const hot = lead.urgency === "Hot" || lead.timeline === "ASAP";
  const prefix = hot ? "[HOT] " : "";

  await resend.emails.send({
    from: fromAddress(),
    to: notify,
    subject: `${prefix}New lead: ${lead.name} — ${lead.build_type || "project"}`,
    text: [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || "—"}`,
      `Build: ${lead.build_type}`,
      `Project: ${lead.project_name || "—"}`,
      `Stage: ${lead.stage || "—"}`,
      `Timeline: ${lead.timeline || "—"}`,
      `Urgency: ${lead.urgency || "—"}`,
      `Call booked: ${lead.call_booked}`,
      `Notes: ${lead.notes || "—"}`,
      `UTM: ${lead.utm_source || "—"} / ${lead.utm_medium || "—"} / ${lead.utm_campaign || "—"}`,
      `Referrer: ${lead.referrer || "—"}`,
      `Page: ${lead.page || "—"}`,
      `Ad campaign: ${lead.ad_campaign || "—"}`,
      `ID: ${lead.id}`,
      `Time: ${lead.timestamp}`,
    ].join("\n"),
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
