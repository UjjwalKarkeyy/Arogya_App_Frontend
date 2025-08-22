import { VaccineRecord } from "../types/Types"
import { vaccineApi } from "../../../config/healthApi"

export async function createVaccination(vaccineData: VaccineRecord): Promise<VaccineRecord> {
  try {
    return await vaccineApi.createVaccineRecord(vaccineData)
  } catch (error) {
    console.error("Error creating vaccination:", error)
    throw error
  }
}

// Default export to prevent expo-router from treating this as a route
export default function CreateVaccinationApiPlaceholder() {
  return null;
}