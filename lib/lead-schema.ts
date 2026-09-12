import { z } from "zod";

export const buildTypeSchema = z.enum([
  "Web App",
  "Mobile App",
  "Automation",
  "AI Feature",
  "Not sure yet",
]);

export const stageSchema = z.enum([
  "Idea",
  "Existing Product",
  "Needs Rebuild",
]);

export const timelineSchema = z.enum(["ASAP", "1–3 months", "Exploring"]);

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => !v || v.length === 0 || /^[+]?[\d\s().-]{7,20}$/.test(v),
    "Enter a valid phone number",
  );

export const leadFormSchema = z.object({
  buildType: buildTypeSchema,
  notes: z.string().max(2000).optional().or(z.literal("")),
  projectName: z.string().min(1, "Project or company name is required").max(200),
  stage: stageSchema,
  timeline: timelineSchema,
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: phoneSchema,
  website: z.string().optional().or(z.literal("")),
  utm_source: z.string().optional().or(z.literal("")),
  utm_campaign: z.string().optional().or(z.literal("")),
  utm_medium: z.string().optional().or(z.literal("")),
  referrer: z.string().optional().or(z.literal("")),
  page: z.string().optional().or(z.literal("")),
  ad_campaign: z.string().optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const adLeadFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: phoneSchema,
  website: z.string().optional().or(z.literal("")),
  utm_source: z.string().optional().or(z.literal("")),
  utm_campaign: z.string().optional().or(z.literal("")),
  utm_medium: z.string().optional().or(z.literal("")),
  referrer: z.string().optional().or(z.literal("")),
  page: z.string().optional().or(z.literal("")),
  ad_campaign: z.string().optional().or(z.literal("")),
  buildType: buildTypeSchema.default("Not sure yet"),
  notes: z.string().optional().or(z.literal("")),
  projectName: z.string().optional().or(z.literal("")),
  stage: stageSchema.default("Idea"),
  timeline: timelineSchema.default("Exploring"),
});

export type AdLeadFormValues = z.infer<typeof adLeadFormSchema>;

export const bookedSchema = z.object({
  id: z.string().min(1),
  call_start: z.string().optional(),
  call_end: z.string().optional(),
});
