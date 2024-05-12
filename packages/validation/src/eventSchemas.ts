import { z } from "zod";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

export const usPhoneSchema = z
.string()
.trim()
.min(1, "Contact is required")
.transform(digitsOnly)
.refine((v) => /^\d{10}$/.test(v), "Contact must be a 10-digit phone number");

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
  contactInfo: usPhoneSchema,
  date: futureIsoDateString,
  location: locationSchema,
});

export const createEventBodySchema = eventFormSchema;
export const updateEventBodySchema = eventFormSchema.partial();

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
