import { VaccineRecord } from "../types/Types"
import { vaccineApi } from "../../../config/healthApi"

export async function getVaccineRecords(filters: {
  name?: string
  date_given?: string
  isVerified?: boolean
}): Promise<VaccineRecord[]> {
  try {
    return await vaccineApi.getVaccineRecords(filters)
  } catch (error) {
    console.error("Error fetching vaccine records:", error)
    throw error
  }
}