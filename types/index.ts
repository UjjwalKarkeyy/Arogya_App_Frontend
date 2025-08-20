export interface Doctor {
  id: number;
  name: string;
  specialty_name?: string;
  specialty?: {
    id: number;
    name: string;
  };
  rating?: string | number;
  reviews?: string | number;
  price?: number;
  opd_time?: string;
  bio?: string;
  experience?: string;
  education?: string;
  location?: string;
  hospital?: string;
  qualifications?: string;
  languages?: string;
  experience_years?: number;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Specialty {
  id: number;
  name: string;
}

export interface AppointmentSlot {
  id: number;
  time: string;
  available: boolean;
}

export interface AppointmentData {
  doctor_id: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
