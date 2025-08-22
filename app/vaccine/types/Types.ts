// Updated types to match backend models and current app structure
export interface VaccineRecord {
  id: string;
  user: number | null;
  vaccine: string; // vaccine ID
  vaccine_id: string;
  vaccine_name: string;
  patient_name: string;
  dose_number: number;
  date_given: string | null;
  administered_by: string | null;
  notes: string | null;
  verified: boolean;
  created_at: string;
  next_due_date: string | null;
  next_dose_number?: number;
}

export interface UpcomingVaccine {
  vaccine_id: string;
  vaccine_name: string;
  next_dose_number: number;
  next_due_date: string | null;
}

export interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  max_doses: number;
  dose_interval_days: number | null;
}