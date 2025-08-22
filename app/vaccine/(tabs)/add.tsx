"use client"

import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createVaccination } from "../api/CreateVaccination"
import { getVaccines } from "../api/GetVaccines"
import { Vaccine, VaccineRecord } from "../types/Types"

function formatDate(date: string): string {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let year = d.getFullYear()

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}


export default function AddVaccineScreen() {
  const [formData, setFormData] = useState<VaccineRecord>({
    id: "",
    user: null,
    patient_name: "John Doe",
    vaccine: "",
    vaccine_id: "",
    vaccine_name: "",
    dose_number: 1,
    date_given: (formatDate(new Date().toISOString())),
    administered_by: "",
    notes: "",
    verified: false,
    created_at: (formatDate(new Date().toISOString())),
    next_due_date: null,
  })

  const [manufacturer, setManufacturer] = useState<string>("")
  const [maxDoses, setMaxDoses] = useState<number>(1)


  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showVaccinePicker, setShowVaccinePicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [vaccines, setVaccines] = useState<Vaccine[]>([])

  useEffect(() => {
    getVaccines().then((vaccines) => {
      setVaccines(vaccines)
    })
  }, [])


  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      await createVaccination(formData)
      
      Alert.alert(
        "Success", 
        "Vaccination record saved successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/vaccine")
            }
          }
        ]
      )
    } catch (error: any) {
      console.error("Error saving record:", error)
      
      let errorMessage = "Failed to save vaccination record. Please try again."
      
      // Handle specific API errors
      if (error.message && typeof error.message === 'string') {
        try {
          const errorObj = JSON.parse(error.message)
          if (errorObj.dose_number) {
            errorMessage = `This dose number already exists for this vaccine. Please check your existing records or use a different dose number.`
          }
        } catch (parseError) {
          // If parsing fails, use the original error message
          errorMessage = error.message
        }
      }
      
      Alert.alert("Error", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVaccineSelection = (key: number) => {
    setFormData({ ...formData, vaccine: vaccines[key].id, vaccine_id: vaccines[key].id, vaccine_name: vaccines[key].name })
    setManufacturer(vaccines[key].manufacturer)
    setMaxDoses(vaccines[key].max_doses || 1)
    setShowVaccinePicker(false)
  }


  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day)
    setFormData({ ...formData, date_given: formatDate(selectedDate.toISOString()) })
    setShowDatePicker(false)
  }

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()
      const isSelected = new Date(formData.date_given!).toDateString() === new Date(currentYear, currentMonth, day).toDateString()

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.calendarDay, isToday && styles.todayDay, isSelected && styles.selectedDay]}
          onPress={() => handleDateSelect(day)}
        >
          <Text style={[styles.calendarDayText, isToday && styles.todayText, isSelected && styles.selectedText]}>
            {day}
          </Text>
        </TouchableOpacity>,
      )
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#2196F3" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>{days}</View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <Ionicons name="add-circle" size={24} color="#2196F3" />
          <Text style={styles.headerTitle}>Add New Vaccination Record</Text>
          <Text style={styles.headerSubtitle}>Record a completed vaccination</Text>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Patient Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full patient name"
              value={formData.patient_name}
              onChangeText={(text) => setFormData({ ...formData, patient_name: text })}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Vaccine Name *</Text>

            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowVaccinePicker(true)}>
              <Text style={styles.pickerText}>Select Vaccine...</Text>
              <Ionicons name="chevron-down" size={20} color="#2196F3" />
            </TouchableOpacity>

            <TextInput  editable={false}
                style={[styles.input, styles.smallInput, {marginTop: 6}]}
                placeholder="Enter manufacturer"
                value={formData.vaccine_name}
                onChangeText={(text) => setFormData({ ...formData, vaccine_name: text })}
                autoCapitalize="words"></TextInput>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Manufacturer</Text>
              <TextInput
                editable={false}
                style={[styles.input, styles.smallInput]}
                placeholder="Enter manufacturer"
                value={manufacturer}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Dose Information</Text>
              <View style={styles.doseContainer}>
                <TextInput
                  style={styles.doseInput}
                  value={formData.dose_number.toString()}
                  onChangeText={(text) => setFormData({ ...formData, dose_number: Number.parseInt(text) || 1 })}
                  keyboardType="numeric"
                  placeholder="1"
                />
                <Text style={styles.doseText}>of {maxDoses}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setFormData({ ...formData, verified: !formData.verified })}
              >
                {formData.verified && <Ionicons name="checkmark" size={16} color="#2196F3" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I know the exact date when this vaccine was given</Text>
            </View>

            <TouchableOpacity
              style={[styles.dateButton, !formData.verified && styles.disabledButton]}
              onPress={() => formData.verified && setShowDatePicker(true)}
              disabled={!formData.verified}
            >
              <Text style={[styles.dateButtonText, !formData.verified && styles.disabledText]}>
                {formData.verified ? new Date(formData.date_given!).toLocaleDateString() : "Date unknown"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={formData.verified ? "#2196F3" : "#ccc"} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Administered By</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Smith, Clinic Name, etc."
              value={formData.administered_by || ""}
              onChangeText={(text) => setFormData({ ...formData, administered_by: text })}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes & Observations</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional notes, side effects, or observations..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.notes || ""}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              autoCapitalize="sentences"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? "Adding Record..." : "Add Vaccination Record"}</Text>
          </TouchableOpacity>
        </ScrollView>

        {showDatePicker && (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.calendarModal}>
                <Text style={styles.modalTitle}>Select Date</Text>
                {renderCalendar()}
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <Modal
          visible={showVaccinePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowVaccinePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Vaccine</Text>
                <TouchableOpacity onPress={() => setShowVaccinePicker(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalContent}>
                {vaccines.map((vaccine, key) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.modalItem]}
                    onPress={() => handleVaccineSelection(key)}
                  >
                    <Text style={[styles.modalItemText]}>
                      {vaccine.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  primaryInput: {
    borderColor: "#2196F3",
    borderWidth: 2,
    marginBottom: 8,
  },
  smallInput: {
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  pickerText: {
    fontSize: 14,
    color: "#2196F3",
  },
  smallPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#f8f9fa",
  },
  smallPickerText: {
    fontSize: 12,
    color: "#2196F3",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  doseContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  doseInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  doseText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#666",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  disabledButton: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
  },
  disabledText: {
    color: "#ccc",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModal: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxWidth: 350,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  calendar: {
    width: "100%",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    width: 35,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  calendarDay: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 17,
  },
  calendarDayText: {
    fontSize: 14,
    color: "#333",
  },
  todayDay: {
    backgroundColor: "#E3F2FD",
  },
  todayText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  selectedDay: {
    backgroundColor: "#2196F3",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  customInputContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  customInputContent: {
    padding: 20,
  },
  customInputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  customInput: {
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  customInputButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalContent: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  customOption: {
    backgroundColor: "#E3F2FD",
  },
  customOptionText: {
    color: "#2196F3",
    fontWeight: "600",
  },
})
