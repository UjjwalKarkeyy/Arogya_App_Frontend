import { UpcomingVaccine } from "../types/Types"
import { vaccineApi } from "../../../config/healthApi"

export async function getUpcomingVaccines(): Promise<UpcomingVaccine[]> {
  try {
    return await vaccineApi.getVaccineNotifications()
  } catch (error) {
    console.error("Error fetching upcoming vaccines:", error)
    throw error
  }
}

// Helper function to check if a vaccine is due soon (within 7 days)
export function isDueSoon(dueDate: string | null): boolean {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= 7 && diffDays >= 0
}

// Helper function to check if a vaccine is overdue
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const now = new Date()
  
  return due < now
}

// Helper function to get days until due
export function getDaysUntilDue(dueDate: string | null): number {
  if (!dueDate) return 0
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Default export to prevent expo-router from treating this as a route
export default function NotificationsApiPlaceholder() {
  return null;
}