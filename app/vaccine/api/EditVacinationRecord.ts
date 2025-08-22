import { VaccineRecord } from "../types/Types"
import { vaccineApi } from "../../../config/healthApi"

export async function editVaccineRecord(id: string, vaccineData: VaccineRecord): Promise<VaccineRecord> {
  try {
    return await vaccineApi.updateVaccineRecord(id, vaccineData)
  } catch (error) {
    console.error("Error editing vaccination record:", error)
    throw error
  }
}

export default function EditVaccinationApiPlaceholder() {
  return null;
}