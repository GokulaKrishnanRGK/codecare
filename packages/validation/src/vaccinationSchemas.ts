import {z} from "zod";

export const vaccinationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  description: z
  .string()
  .trim()
  .min(1, "Description is required")
  .max(2000, "Description is too long"),
});

export const createVaccinationBodySchema = vaccinationSchema;

export const updateVaccinationBodySchema = vaccinationSchema.partial().refine(
    (v) => v.name !== undefined || v.description !== undefined,
    {message: "At least one field is required"}
);

export const createVaccinationClientSchema = vaccinationSchema;
export const updateVaccinationClientSchema = vaccinationSchema.partial().refine(
    (v) => v.name !== undefined || v.description !== undefined,
    {message: "At least one field is required"}
);

export type VaccinationValues = z.infer<typeof vaccinationSchema>;
export type CreateVaccinationBody = z.infer<typeof createVaccinationBodySchema>;
export type UpdateVaccinationBody = z.infer<typeof updateVaccinationBodySchema>;
export type CreateVaccinationClient = z.infer<typeof createVaccinationClientSchema>;
export type UpdateVaccinationClient = z.infer<typeof updateVaccinationClientSchema>;
