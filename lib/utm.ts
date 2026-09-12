export type UtmParams = {
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  referrer?: string;
};

const STORAGE_KEY = "nexode_utm";

export function captureUtmFromSearch(search: string, referrer?: string): UtmParams {
  const params = new URLSearchParams(search);
  const next: UtmParams = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    referrer: referrer || undefined,
  };

  const hasAny = Object.values(next).some(Boolean);
  if (typeof window === "undefined") return next;

  const existing = readStoredUtm();
  if (hasAny) {
    const merged = { ...existing, ...stripEmpty(next) };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  if (!existing.referrer && referrer) {
    const merged = { ...existing, referrer };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  return existing;
}

export function readStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}

function stripEmpty(obj: UtmParams): UtmParams {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => Boolean(v)),
  ) as UtmParams;
}
