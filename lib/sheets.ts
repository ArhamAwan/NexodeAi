import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, type GoogleSpreadsheetRow } from "google-spreadsheet";

export const LEAD_HEADERS = [
  "id",
  "timestamp",
  "name",
  "email",
  "phone",
  "build_type",
  "notes",
  "project_name",
  "stage",
  "timeline",
  "urgency",
  "call_booked",
  "call_start",
  "call_end",
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "referrer",
  "page",
  "ad_campaign",
  "status",
] as const;

export type LeadRow = {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  build_type: string;
  notes?: string;
  project_name?: string;
  stage?: string;
  timeline?: string;
  urgency?: string;
  call_booked: string;
  call_start?: string;
  call_end?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  referrer?: string;
  page?: string;
  ad_campaign?: string;
  status: string;
};

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error(
      "Missing Google Sheets credentials. Set GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY.",
    );
  }

  return {
    sheetId,
    auth: new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    }),
  };
}

async function getLeadsSheet() {
  const { sheetId, auth } = getAuth();
  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle["Leads"];
  if (!sheet) {
    sheet = await doc.addSheet({
      title: "Leads",
      headerValues: [...LEAD_HEADERS],
    });
  } else {
    await sheet.loadHeaderRow();
    if (!sheet.headerValues?.length) {
      await sheet.setHeaderRow([...LEAD_HEADERS]);
    }
  }

  return sheet;
}

export async function appendLead(row: LeadRow) {
  const sheet = await getLeadsSheet();
  await sheet.addRow({ ...row });
  return row;
}

export async function updateLeadBooking(
  id: string,
  data: { call_start?: string; call_end?: string },
) {
  const sheet = await getLeadsSheet();
  const rows = await sheet.getRows();
  const match = rows.find((r) => r.get("id") === id);
  if (!match) {
    throw new Error("Lead not found");
  }

  match.set("call_booked", "true");
  match.set("status", "call_booked");
  if (data.call_start) match.set("call_start", data.call_start);
  if (data.call_end) match.set("call_end", data.call_end);
  await match.save();
  return rowToLead(match);
}

export async function findRecentLeadByEmail(email: string, withinMs: number) {
  const sheet = await getLeadsSheet();
  const rows = await sheet.getRows({ limit: 50 });
  const needle = email.toLowerCase();
  const now = Date.now();

  for (let i = rows.length - 1; i >= 0; i -= 1) {
    const row = rows[i];
    if ((row.get("email") ?? "").toLowerCase() !== needle) continue;
    const ts = Date.parse(row.get("timestamp") ?? "");
    if (!Number.isNaN(ts) && now - ts < withinMs) {
      return rowToLead(row);
    }
  }

  return null;
}

function rowToLead(row: GoogleSpreadsheetRow): LeadRow {
  return {
    id: row.get("id") ?? "",
    timestamp: row.get("timestamp") ?? "",
    name: row.get("name") ?? "",
    email: row.get("email") ?? "",
    phone: row.get("phone") ?? "",
    build_type: row.get("build_type") ?? "",
    notes: row.get("notes") ?? "",
    project_name: row.get("project_name") ?? "",
    stage: row.get("stage") ?? "",
    timeline: row.get("timeline") ?? "",
    urgency: row.get("urgency") ?? "",
    call_booked: row.get("call_booked") ?? "false",
    call_start: row.get("call_start") ?? "",
    call_end: row.get("call_end") ?? "",
    utm_source: row.get("utm_source") ?? "",
    utm_campaign: row.get("utm_campaign") ?? "",
    utm_medium: row.get("utm_medium") ?? "",
    referrer: row.get("referrer") ?? "",
    page: row.get("page") ?? "",
    ad_campaign: row.get("ad_campaign") ?? "",
    status: row.get("status") ?? "",
  };
}
