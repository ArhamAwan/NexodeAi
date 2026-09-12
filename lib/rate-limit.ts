import { findRecentLeadByEmail } from "./sheets";

const WINDOW_MS = 10 * 60 * 1000;

export async function isRateLimited(email: string): Promise<boolean> {
  try {
    const recent = await findRecentLeadByEmail(email, WINDOW_MS);
    return Boolean(recent);
  } catch {
    // If Sheets is unavailable, don't block the request on rate-limit lookup failure
    return false;
  }
}
