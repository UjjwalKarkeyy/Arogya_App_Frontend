export interface Doctor {
  id: number;
  name: string;
  specialty_name: string;
  specialty?: Specialty;
  rating: string;
  reviews: string;
  price: number;
  opd_time: string;
  bio: string;
  experience: string;
  education: string;
  location: string;
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

// Forum types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  discussion_count: number;
}

export interface Discussion {
  id: number;
  title: string;
  content?: string;
  author: User;
  category: ForumCategory;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  reply_count: number;
  last_reply?: Reply;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  content: string;
  author: User;
  created_at: string;
  updated_at: string;
  is_solution: boolean;
}
