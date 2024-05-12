import { z } from "zod";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

const isValidPhone = (v: string) => /^\d{10}$/.test(digitsOnly(v));
const isValidEmail = (v: string) => z.email().safeParse(v).success;

export const contactInfoSchema = z
.string()
.trim()
.min(1, "Contact is required")
.refine((v) => isValidPhone(v) || isValidEmail(v), {
  message: "Enter a valid 10-digit phone number or email address",
})
.transform((v) => (isValidPhone(v) ? digitsOnly(v) : v));

export const postalCodeSchema = z
.string()
.trim()
.min(1, "Postal code is required")
.refine((v) => /^\d{5}(-\d{4})?$/.test(v), "Invalid postal code");

export const futureIsoDateString = z
.string()
.refine((v) => !Number.isNaN(new Date(v).getTime()), "Invalid date")
.refine((v) => new Date(v).getTime() > Date.now(), "Event date must be in the future");

export const locationSchema = z.object({
  address: z.string().trim().min(1, "Address is required").max(250),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  country: z.string().trim().min(1, "Country is required").max(100),
  postalCode: postalCodeSchema,
});

export const eventFormSchema = z.object({
  type: z.string().trim().min(1, "Event type is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(250),
  organizer: z.string().trim().min(1, "Organizer is required").max(150),
  description: z.string().trim().min(1, "Description is required").max(5000),
  contactInfo: contactInfoSchema,
  date: futureIsoDateString,
  endTime: futureIsoDateString,
  location: locationSchema,
})
.superRefine(({ date, endTime }, ctx) => {
  const start = new Date(date).getTime();
  const end = new Date(endTime).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return;

  if (end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "End time must be after the start time",
    });
  }
});

export const createEventBodySchema = eventFormSchema;

export const updateEventBodySchema = z
.object({
  type: z.string().trim().min(1).max(100).optional(),
  title: z.string().trim().min(1).max(250).optional(),
  organizer: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  contactInfo: contactInfoSchema.optional(),
  date: futureIsoDateString.optional(),
  endTime: futureIsoDateString.optional(),
  location: locationSchema.partial().optional(),
})
.superRefine((data, ctx) => {
  if (data.date && data.endTime) {
    const start = new Date(data.date).getTime();
    const end = new Date(data.endTime).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after the start time",
      });
    }
  }
});

export const createEventClientSchema = eventFormSchema.extend({
  eventImage: z.instanceof(File).optional(),
});

export const updateEventClientSchema = eventFormSchema.extend({
  eventImage: z.instanceof(File).optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type CreateEventClient = z.infer<typeof createEventClientSchema>;
export type UpdateEventClient = z.infer<typeof updateEventClientSchema>;
export type CreateEventBody = z.infer<typeof createEventBodySchema>;
export type UpdateEventBody = z.infer<typeof updateEventBodySchema>;
