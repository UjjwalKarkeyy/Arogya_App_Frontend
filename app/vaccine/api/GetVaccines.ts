import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { API_ENDPOINTS } from "../../../config/healthApi"
import { Vaccine, vaccineSchema } from "../types/Types"



export const getVaccines = async (): Promise<Vaccine[]> => {

  const token = await AsyncStorage.getItem("token")
  if (!token) {
    return []
  }
  const tokenWithoutSpaces = token.replace(/[\n\s]+/g, '')

  try {
    const response = await axios.get(`${API_ENDPOINTS.VACCINES}`, {
      headers: {
        "Authorization": `Bearer ${tokenWithoutSpaces}`,
      },
    })
    return response.data.map((record: Vaccine) => vaccineSchema.parse(record))
  } catch (error) {
    console.error("Error getting vaccines:", error)
    return []
  }
  
}