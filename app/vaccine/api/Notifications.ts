import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { API_ENDPOINTS } from "../../../config/healthApi"
import { UpcomingVaccine, upcomingVaccineSchema } from "../types/Types"


export const getUpcomingVaccines = async (): Promise<UpcomingVaccine[]> => {

  const token = await AsyncStorage.getItem("token")
  if (!token) {
    return []
  }
  const tokenWithoutSpaces = token.replace(/[\n\s]+/g, '')

  try {
    const response = await axios.get(`${API_ENDPOINTS.VACCINATION_NOTIFICATIONS}`, {
      headers: {
        "Authorization": `Bearer ${tokenWithoutSpaces}`,
      },
    })
    return response.data.map((record: UpcomingVaccine) => upcomingVaccineSchema.parse(record))
  } catch (error) {
    console.error("Error getting upcoming vaccines:", error)
    return []
  }
}