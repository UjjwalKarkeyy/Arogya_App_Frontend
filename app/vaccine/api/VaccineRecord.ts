import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { API_ENDPOINTS } from "../../../config/healthApi"
import { VaccineRecord, vaccineRecordSchema } from "../types/Types"

const buildQuery = (params: Record<string, any>): string => {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null) 
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&")
  
    return query ? `?${query}` : ""
  }

export const getVaccineRecords = async (query: Record<string, any>): Promise<VaccineRecord[]> => {

  const token = await AsyncStorage.getItem("token")
  if (!token) {
    return []
  }
  const tokenWithoutSpaces = token.replace(/[\n\s]+/g, '')

  try {
    const response = await axios.get(`${API_ENDPOINTS.VACCINATIONS}`, {
      headers: {
        "Authorization": `Bearer ${tokenWithoutSpaces}`,
      },
    })
    return response.data.map((record: VaccineRecord) => vaccineRecordSchema.parse(record))
  } catch (error) {
    console.error("Error getting vaccine records:", error)
    return []
  }
}