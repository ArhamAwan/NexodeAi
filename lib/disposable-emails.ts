const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.de",
  "sharklasers.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "yopmail.com",
  "trashmail.com",
  "discard.email",
  "getnada.com",
  "fakeinbox.com",
  "maildrop.cc",
  "throwawaymail.com",
  "tempail.com",
  "emailondeck.com",
  "moakt.com",
  "mintemail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return true;
  return DISPOSABLE.has(domain);
}
