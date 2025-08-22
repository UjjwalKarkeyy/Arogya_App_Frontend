import { vaccineApi } from "../../config/healthApi"

export async function deleteVaccinationRecord(id: string): Promise<void> {
  try {
    await vaccineApi.deleteVaccineRecord(id)
  } catch (error) {
    console.error("Error deleting vaccination record:", error)
    throw error
  }
}

// Default export to prevent expo-router from treating this as a route
export default function DeleteVaccinationApiPlaceholder() {
  return null;
}