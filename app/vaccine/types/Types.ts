import { z } from "zod"

export const vaccineRecordSchema = z.object({
  id: z.string(),
  user: z.number().nullable(),
  vaccine: z.string(),
  vaccine_id: z.string().optional(),
  vaccine_name: z.string(),
  dose_number: z.number(),
  date_given: z.string().nullable(),
  administered_by: z.string().nullable(),
  notes: z.string().nullable(),
  verified: z.boolean(),
  created_at: z.string(),
  patient_name: z.string().default(""),
  next_due_date: z.string().optional().nullable(),
  next_dose_number: z.number().optional(),
});
  
export type VaccineRecord = z.infer<typeof vaccineRecordSchema>;
  
  
export const upcomingVaccineSchema = z.object({
  vaccine_id: z.string(),
  vaccine_name: z.string(),
  next_dose_number: z.number(),
  next_due_date: z.string().nullable(),
});

export type UpcomingVaccine = z.infer<typeof upcomingVaccineSchema>;

export const vaccineSchema = z.object({
  id: z.string(),
  name: z.string(),
  manufacturer: z.string(),
  max_doses: z.number(),
  dose_interval_days: z.number(),
});

export type Vaccine = z.infer<typeof vaccineSchema>;