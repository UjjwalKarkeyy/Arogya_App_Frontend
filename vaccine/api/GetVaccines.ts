import { Vaccine } from "../types/Types"
import { vaccineApi } from "../../config/healthApi"

export async function getVaccines(): Promise<Vaccine[]> {
  try {
    return await vaccineApi.getVaccines()
  } catch (error) {
    console.error("Error fetching vaccines:", error)
    throw error
  }
}