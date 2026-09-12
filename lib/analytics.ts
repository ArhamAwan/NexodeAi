type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta standard events we use for ads optimization */
export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "Schedule"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "SubmitApplication";

function cleanPayload(payload: AnalyticsPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );
}

export function trackMeta(
  event: MetaStandardEvent,
  payload: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", event, cleanPayload(payload));
  } catch {
    /* ignore */
  }
}

export function trackMetaCustom(name: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", name, cleanPayload(payload));
  } catch {
    /* ignore */
  }
}

export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", name, cleanPayload(payload));
  } catch {
    /* ignore */
  }

  trackMetaCustom(name, payload);
}

/**
 * Fire on every meaningful button/CTA click.
 * Sends GA4 + Meta custom `CTAClick`, plus a mapped standard Meta event when relevant.
 */
export function trackCta(
  cta:
    | "start_project"
    | "book_call"
    | "funnel_continue"
    | "funnel_back"
    | "funnel_skip_booking"
    | "view_case_study"
    | "nav_link"
    | "menu_toggle"
    | "close"
    | string,
  location: string,
  extra: AnalyticsPayload = {},
) {
  const payload = { cta, location, ...extra };

  trackEvent("cta_click", payload);
  trackMetaCustom("CTAClick", payload);

  switch (cta) {
    case "start_project":
      // Funnel open — strong intent signal for ads
      trackMeta("InitiateCheckout", {
        content_name: "Start a Project",
        content_category: location,
      });
      break;
    case "book_call":
      trackMeta("Contact", {
        content_name: "Book a Call",
        content_category: location,
      });
      break;
    case "view_case_study":
      trackMeta("ViewContent", {
        content_name: String(extra.content_name ?? "Case study"),
        content_category: "portfolio",
        content_type: "product",
      });
      break;
    default:
      break;
  }
}

export function trackFunnelStep(step: number, variant: "full" | "ads" = "full") {
  trackEvent("funnel_step_completed", { step, variant });
  trackMetaCustom("FunnelStep", { step, variant });
}

export function trackFormSubmitted(variant: "full" | "ads" = "full") {
  trackEvent("form_submitted", { variant });
  trackMeta("Lead", {
    content_name: "Project intake",
    content_category: variant,
  });
  trackMetaCustom("FormSubmitted", { variant });
}

export function trackCallBooked(variant: "full" | "ads" = "full") {
  trackEvent("call_booked", { variant });
  trackMeta("Schedule", {
    content_name: "Calendly booking",
    content_category: variant,
  });
  trackMetaCustom("CallBooked", { variant });
}
