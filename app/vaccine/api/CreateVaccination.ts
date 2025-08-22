import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { API_ENDPOINTS } from "../../../config/healthApi"
import { VaccineRecord } from "../types/Types"

export const createVaccination = async (data: VaccineRecord): Promise<void> => {

  const token = await AsyncStorage.getItem("token")
  if (!token) {
    return
  }
  const tokenWithoutSpaces = token.replace(/[\n\s]+/g, '')

  try {
    await axios.post(`${API_ENDPOINTS.VACCINATIONS}`, data, {
      headers: {
        "Authorization": `Bearer ${tokenWithoutSpaces}`,
      },
    })
  } catch (error) {
    console.error("Error creating vaccination record:", error)
  }
}