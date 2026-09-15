"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { buildTypes, stages, timelines } from "@/content/site";
import { leadFormSchema, type LeadFormValues } from "@/lib/lead-schema";
import { readStoredUtm } from "@/lib/utm";
import {
  trackCallBooked,
  trackCta,
  trackFormSubmitted,
  trackFunnelStep,
} from "@/lib/analytics";
import { CalendlyEmbed } from "@/components/calendly-embed";

export type FunnelPanelProps = {
  variant?: "full" | "ads";
  adCampaign?: string;
  pagePath?: string;
  compact?: boolean;
  className?: string;
  rootId?: string;
};

const FULL_STEPS = 4;
const ADS_STEPS = 2;

export function FunnelPanel({
  variant = "full",
  adCampaign,
  pagePath = "/",
  compact = false,
  className = "",
  rootId = "funnel",
}: FunnelPanelProps) {
  const router = useRouter();
  const totalSteps = variant === "ads" ? ADS_STEPS : FULL_STEPS;
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const defaults = useMemo<LeadFormValues>(
    () => ({
      buildType: "Not sure yet",
      notes: "",
      projectName: variant === "ads" ? "Ad inquiry" : "",
      stage: "Idea",
      timeline: "Exploring",
      name: "",
      email: "",
      phone: "",
      website: "",
      utm_source: "",
      utm_campaign: "",
      utm_medium: "",
      referrer: "",
      page: pagePath,
      ad_campaign: adCampaign ?? "",
    }),
    [variant, pagePath, adCampaign],
  );

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  const { register, setValue, trigger, getValues, control, formState } = form;

  useEffect(() => {
    const utm = readStoredUtm();
    setValue("utm_source", utm.utm_source ?? "");
    setValue("utm_campaign", utm.utm_campaign ?? "");
    setValue("utm_medium", utm.utm_medium ?? "");
    setValue("referrer", utm.referrer ?? "");
    setValue("page", pagePath);
    if (adCampaign) setValue("ad_campaign", adCampaign);
  }, [setValue, pagePath, adCampaign]);

  const buildType = useWatch({ control, name: "buildType" });
  const stage = useWatch({ control, name: "stage" });
  const timeline = useWatch({ control, name: "timeline" });

  async function goNext() {
    setApiError(null);
    let fields: (keyof LeadFormValues)[] = [];

    if (variant === "full") {
      if (step === 1) fields = ["buildType"];
      if (step === 2) fields = ["projectName", "stage", "timeline"];
      if (step === 3) fields = ["name", "email", "phone"];
    } else if (step === 1) {
      fields = ["name", "email", "phone"];
    }

    const ok = await trigger(fields);
    if (!ok) return;

    if (
      (variant === "full" && step === 3) ||
      (variant === "ads" && step === 1)
    ) {
      const submitted = await submitLead();
      if (!submitted) return;
    }

    trackFunnelStep(step, variant);
    setStep((s) => Math.min(s + 1, totalSteps));
  }

  async function submitLead() {
    setSubmitting(true);
    setApiError(null);
    try {
      const values = getValues();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error ?? "Something went wrong. Please try again.");
        return false;
      }
      setLeadId(data.id);
      trackFormSubmitted(variant);
      return true;
    } catch {
      setApiError("Network error. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function skipBooking() {
    trackCta("funnel_skip_booking", compact ? "funnel_compact" : "funnel", {
      variant,
    });
    trackFunnelStep(totalSteps, variant);
    router.push("/thank-you?booked=0");
  }

  async function handleBooked(payload: {
    startTime?: string;
    endTime?: string;
  }) {
    if (leadId) {
      try {
        await fetch("/api/leads/booked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leadId,
            call_start: payload.startTime,
            call_end: payload.endTime,
          }),
        });
      } catch {
        /* booking still happened in Calendly */
      }
    }
    trackCallBooked(variant);
    router.push("/thank-you?booked=1");
  }

  const calendlyStep = variant === "full" ? 4 : 2;
  const chip =
    "border px-2.5 py-1.5 text-xs transition sm:text-sm sm:px-3 sm:py-2";

  return (
    <div id={rootId} className={`relative ${className ?? ""}`} tabIndex={-1}>
      <div className={`flex items-start justify-between gap-3 ${compact ? "mb-4" : "mb-5"}`}>
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
            {variant === "ads" ? "Intake" : "Tell us your story"}
          </p>
          <h2
            className={`font-display mt-2 font-semibold tracking-tight ${
              compact ? "text-xl" : "text-2xl md:text-3xl"
            }`}
          >
            {variant === "ads" ? "Book a discovery call" : "Start a project"}
          </h2>
          {!compact ? (
            <p className="mt-1.5 text-sm text-muted">
              A short brief. Then a call — if you want one.
            </p>
          ) : null}
        </div>
        <p className="font-mono text-xs tracking-wider text-muted whitespace-nowrap">
          {step}/{totalSteps}
        </p>
      </div>

      <div className={`h-px overflow-hidden bg-[var(--line)] ${compact ? "mb-4" : "mb-6"}`}>
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      {variant === "full" && step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm font-medium">What are you looking to build?</p>
          <div className="flex flex-wrap gap-2">
            {buildTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`${chip} ${
                  buildType === type
                    ? "border-foreground bg-foreground text-background"
                    : "border-[var(--line)] text-muted hover:border-[var(--line-strong)] hover:text-foreground"
                }`}
                onClick={() =>
                  setValue("buildType", type, { shouldValidate: true })
                }
              >
                {type}
              </button>
            ))}
          </div>
          <label className="block text-sm">
            <span className="text-muted">Anything else? (optional)</span>
            <textarea
              className="mt-2 w-full border border-[var(--line)] bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--line-strong)]"
              rows={compact ? 1 : 3}
              {...register("notes")}
            />
          </label>
        </div>
      ) : null}

      {variant === "full" && step === 2 ? (
        <div className="space-y-4">
          <label className="block text-sm">
            <span>Project / company name</span>
            <input
              className="mt-2 w-full border border-[var(--line)] bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--line-strong)]"
              {...register("projectName")}
            />
            {formState.errors.projectName ? (
              <span className="mt-1 block text-xs text-red-400">
                {formState.errors.projectName.message}
              </span>
            ) : null}
          </label>

          <div>
            <p className="text-sm">Current stage</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${chip} ${
                    stage === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-[var(--line)] text-muted"
                  }`}
                  onClick={() => setValue("stage", s, { shouldValidate: true })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm">Timeline</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {timelines.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${chip} ${
                    timeline === t
                      ? "border-foreground bg-foreground text-background"
                      : "border-[var(--line)] text-muted"
                  }`}
                  onClick={() =>
                    setValue("timeline", t, { shouldValidate: true })
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {(variant === "full" && step === 3) ||
      (variant === "ads" && step === 1) ? (
        <div className="space-y-3">
          <label className="block text-sm">
            <span>Name</span>
            <input
              className="mt-2 w-full border border-[var(--line)] bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--line-strong)]"
              {...register("name")}
            />
            {formState.errors.name ? (
              <span className="mt-1 block text-xs text-red-400">
                {formState.errors.name.message}
              </span>
            ) : null}
          </label>
          <label className="block text-sm">
            <span>Email</span>
            <input
              type="email"
              className="mt-2 w-full border border-[var(--line)] bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--line-strong)]"
              {...register("email")}
            />
            {formState.errors.email ? (
              <span className="mt-1 block text-xs text-red-400">
                {formState.errors.email.message}
              </span>
            ) : null}
          </label>
          <label className="block text-sm">
            <span>Phone (optional)</span>
            <input
              type="tel"
              className="mt-2 w-full border border-[var(--line)] bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--line-strong)]"
              {...register("phone")}
            />
            {formState.errors.phone ? (
              <span className="mt-1 block text-xs text-red-400">
                {formState.errors.phone.message}
              </span>
            ) : null}
          </label>
        </div>
      ) : null}

      {step === calendlyStep ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Pick a time. Calendly sends the invite and reminders.
          </p>
          <CalendlyEmbed
            prefill={{
              name: getValues("name"),
              email: getValues("email"),
            }}
            onEventScheduled={handleBooked}
            className={
              compact
                ? "calendly-inline-widget min-h-[min(520px,70svh)] w-full"
                : "calendly-inline-widget min-h-[min(650px,75svh)] w-full"
            }
          />
          <button
            type="button"
            className="btn-secondary w-full text-sm"
            onClick={skipBooking}
          >
            Skip for now
          </button>
        </div>
      ) : null}

      {apiError ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {apiError}
        </p>
      ) : null}

      {step < calendlyStep ? (
        <div className={`flex items-center justify-between gap-3 ${compact ? "mt-5" : "mt-6"}`}>
          <button
            type="button"
            className="text-sm text-muted hover:text-foreground disabled:opacity-40"
            disabled={step === 1 || submitting}
            onClick={() => {
              trackCta("funnel_back", compact ? "funnel_compact" : "funnel", {
                step,
                variant,
              });
              setStep((s) => Math.max(1, s - 1));
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="btn-primary shrink-0 !px-4 !py-2 text-sm"
            disabled={submitting}
            onClick={() => {
              trackCta("funnel_continue", compact ? "funnel_compact" : "funnel", {
                step,
                variant,
              });
              void goNext();
            }}
          >
            {submitting
              ? "Saving…"
              : step === totalSteps - 1
                ? "Continue to booking"
                : "Continue"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
