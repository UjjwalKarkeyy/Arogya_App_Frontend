import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { API_ENDPOINTS } from "../../../config/healthApi"

export const deleteVaccinationRecord = async (id: string): Promise<void> => {

  const token = await AsyncStorage.getItem("token")
  if (!token) {
    return
  }
  const tokenWithoutSpaces = token.replace(/[\n\s]+/g, '')

  try {
  await axios.delete(`${API_ENDPOINTS.VACCINATIONS}${id}/`, {
    headers: {
      "Authorization": `Bearer ${tokenWithoutSpaces}`,
    },
  })
  } catch (error) {
    console.error("Error deleting vaccination record:", error)
  }
}