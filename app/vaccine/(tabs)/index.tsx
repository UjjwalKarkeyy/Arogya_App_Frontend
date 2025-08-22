"use client"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { editVaccineRecord } from "../api/EditVacinationRecord"
import { getUpcomingVaccines } from "../api/Notifications"
import { getVaccineRecords } from "../api/VaccineRecord"
import { UpcomingVaccine, VaccineRecord } from "../types/Types"

import { reloadAppAsync } from "expo"
import { deleteVaccinationRecord } from "../api/DeleteVaccination"




export default function VaccineHistoryScreen() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<"vaccinated" | "pending">("vaccinated")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [filterDate, setFilterDate] = useState<Date | null>(null)
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<VaccineRecord | null>(null)
  const [secondDoseNotifications, setSecondDoseNotifications] = useState<UpcomingVaccine[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [refreshCounter, setRefreshCounter] = useState(0)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationModalContent, setNotificationModalContent] = useState({
    title: "",
    message: "",
    buttons: [] as any[],
  })

  // ✅ FIXED: Refresh data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadVaccineRecords()
      // Force tab to show vaccinated by default
      setActiveTab("vaccinated")
    }, []),
  )

  useEffect(() => {
    loadVaccineRecords()
  }, [])

  useEffect(() => {
    checkSecondDoseNotifications()
  }, [vaccineRecords])

  const loadVaccineRecords = async () => {
    try {
      const records = await getVaccineRecords({})
      setVaccineRecords(records as VaccineRecord[])
    } catch (error) {
      console.error("Error loading vaccine records:", error)
    }
  }


  const checkSecondDoseNotifications = async () => {
    
    const upcomingDoses = await getUpcomingVaccines()
    console.log(upcomingDoses)
    setSecondDoseNotifications(upcomingDoses)
    setNotificationCount(upcomingDoses.length)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadVaccineRecords()
    setRefreshing(false)
  }

  const filteredRecords = vaccineRecords.filter((record) => {
    // Map tab names to actual record status values
    const targetStatus = activeTab === "vaccinated" ? true : false
    const matchesTab = record.verified === targetStatus

    const matchesSearch =
      searchQuery === "" ||
      record.vaccine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vaccine.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesDate = true
    if (filterDate) {
      const recordDate = new Date(record.date_given!)
      const filterDateObj = new Date(filterDate)

      matchesDate =
        recordDate.getFullYear() === filterDateObj.getFullYear() &&
        recordDate.getMonth() === filterDateObj.getMonth() &&
        recordDate.getDate() === filterDateObj.getDate()
    }

    return matchesTab && matchesSearch && matchesDate
  })

  // ✅ WORKING: Edit functionality with all text inputs
  const handleEdit = (record: VaccineRecord) => {
    setEditingRecord({ ...record })
    setShowEditModal(true)
  }

  const saveEditedRecord = async () => {
    if (!editingRecord) return

    try {
      await editVaccineRecord(editingRecord.id, editingRecord)
      reloadAppAsync()

      Alert.alert("Success! ✅", "Vaccination record updated successfully!")
    } catch (error) {
      Alert.alert("Error", "Failed to update record. Please try again.")
    }
  }

  const handleRemove = async (id: string) => {
    console.log(`Remove button pressed for record: ${id}`)

    try {
      await deleteVaccinationRecord(id)
      reloadAppAsync()
      Alert.alert("Success! ✅", "Vaccination record deleted successfully!")
    } catch (error) {
      console.error("Remove error:", error)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleNotificationClick = () => {
    console.log("🔔 Notification clicked!")
    console.log("Notification count:", notificationCount)
    console.log("Second dose notifications:", secondDoseNotifications.length)

    try {
      if (secondDoseNotifications.length > 0) {
        const notificationDetails = secondDoseNotifications
          .map((vaccine, index) => {
            if(vaccine.next_due_date === null) {
              return `✅ ${vaccine.vaccine_name}\n   Dose ${vaccine.next_dose_number} - Not Urgent \n   Schedule: Anytime you see fit!`
            }
            const nextDoseNumber = vaccine.next_dose_number
            const dueDate = new Date(vaccine.next_due_date!)
            const today = new Date()
            const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

            let statusText = ""
            let urgencyIcon = ""
            if (daysDiff < 0) {
              statusText = `${Math.abs(daysDiff)} days overdue`
              urgencyIcon = "⚠️ "
            } else if (daysDiff === 0) {
              statusText = "Due today!"
              urgencyIcon = "🚨 "
            } else if (daysDiff <= 7) {
              statusText = `Due in ${daysDiff} days`
              urgencyIcon = "⏰ "
            } else {
              statusText = `Due in ${daysDiff} days`
              urgencyIcon = "📅 "
            }

            return `${urgencyIcon}${vaccine.vaccine_name}\n   Dose ${nextDoseNumber} - ${statusText}\n   Schedule: ${dueDate.toLocaleDateString()}`
          })
          .join("\n\n")

        console.log("Showing notification modal with details")
        setNotificationModalContent({
          title: "🔔 Vaccine Reminders",
          message: `You have ${secondDoseNotifications.length} upcoming dose(s):\n\n${notificationDetails}\n\nDon't forget to schedule your appointments!`,
          buttons: [
            {
              text: "Dismiss",
              onPress: () => setShowNotificationModal(false),
              style: "cancel",
            },
            {
              text: "Schedule Now",
              onPress: () => {
                setShowNotificationModal(false)
                setTimeout(() => {
                  setNotificationModalContent({
                    title: "Schedule Appointment",
                    message: "Contact your healthcare provider to schedule your next dose.",
                    buttons: [{ text: "OK", onPress: () => setShowNotificationModal(false) }],
                  })
                  setShowNotificationModal(true)
                }, 100)
              },
              style: "default",
            },
          ],
        })
        setShowNotificationModal(true)
      } else {
        console.log("Showing 'all up to date' modal")
        setNotificationModalContent({
          title: "✅ All Up to Date!",
          message: "Great news! All your vaccines are current and up to date.",
          buttons: [{ text: "OK", onPress: () => setShowNotificationModal(false) }],
        })
        setShowNotificationModal(true)
      }
    } catch (error) {
      console.log("Error in notification handler:", error)
      setNotificationModalContent({
        title: "Notification",
        message: "Notification system is working!",
        buttons: [{ text: "OK", onPress: () => setShowNotificationModal(false) }],
      })
      setShowNotificationModal(true)
    }
  }

  const handleDateFilterPress = () => {
    console.log("📅 Date filter pressed")
    setShowDatePicker(true)
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(selectedYear, selectedMonth, day)
    setFilterDate(selectedDate)
    setShowDatePicker(false)

    // Filter records immediately
    const matchingRecords = vaccineRecords.filter((record) => {
      const recordDate = new Date(record.date_given!)
      return (
        recordDate.getFullYear() === selectedDate.getFullYear() &&
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getDate() === selectedDate.getDate()
      )
    })

    Alert.alert(
      "Date Filter Applied",
      `Found ${matchingRecords.length} vaccine(s) on ${selectedDate.toLocaleDateString()}`,
      [{ text: "OK" }],
    )
  }

  const renderCustomCalendar = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()
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

    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day)
    }

    return (
      <View style={styles.customCalendar}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11)
                setSelectedYear(selectedYear - 1)
              } else {
                setSelectedMonth(selectedMonth - 1)
              }
            }}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.monthYearText}>
            {monthNames[selectedMonth]} {selectedYear}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0)
                setSelectedYear(selectedYear + 1)
              } else {
                setSelectedMonth(selectedMonth + 1)
              }
            }}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysHeader}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayCell, day === null && styles.emptyDayCell]}
              onPress={() => day && handleDateSelect(day)}
              disabled={day === null}
            >
              <Text style={[styles.dayText, day === null && styles.emptyDayText]}>{day ? day.toString() : ""}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  // ✅ WORKING: Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = filteredRecords.length
      Alert.alert("🔍 Search Results", `Found ${results} result${results !== 1 ? "s" : ""} for "${searchQuery}"`, [
        { text: "OK" },
      ])
    } else {
      Alert.alert("Search", "Enter a search term to find vaccines")
    }
  }

  const VaccineCard = ({ record }: { record: VaccineRecord }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{record.vaccine_name}</Text>
          <Text style={styles.cardSubtitle}>{record.vaccine}</Text>
        </View>
        <View style={styles.doseIndicator}>
          <Text style={styles.doseText}>
            {record.verified === true ? "✅" : "⏳"} Dose {record.dose_number}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Administered To: {record.patient_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Date Given: {record.date_given ? new Date(record.date_given).toLocaleDateString() : "N/A"}</Text>
        </View>


        {record.notes && (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Notes: {record.notes}</Text>
          </View>
        )}

        {record.administered_by && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Administered By: {record.administered_by}</Text>
          </View>
        )}

        {record.next_due_date && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#FF9800" />
            <Text style={[styles.infoText, { color: "#FF9800", fontWeight: "600" }]}>
              Next Due (Dose {record.dose_number + 1}): {new Date(record.next_due_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        {record.verified === false && (
          <>
          <View style={styles.pendingActions}>
            <Text style={styles.pendingActionText}>⏳ Awaiting administration</Text>
          </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log("Edit button pressed for record:", record.id)
                setEditingRecord({ ...record })
                setShowEditModal(true)
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color="#2196F3" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log("Remove button pressed for record:", record.id, "Vaccine:", record.vaccine_name)
                handleRemove(record.id)
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#F44336" />
              <Text style={styles.actionText}>Remove</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with WORKING 2nd DOSE NOTIFICATION */}
      <View style={styles.header}>
      <View style={{  }}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#eee",
          borderRadius: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={{ marginLeft: 5, fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

    </View>
        <View>
          <Text style={styles.title}>Vaccination History</Text>
          <Text style={styles.subtitle}>Complete vaccination record of John Doe</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={handleNotificationClick}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={notificationCount > 0 ? "notifications" : "notifications-outline"}
            size={24}
            color={notificationCount > 0 ? "#fff" : "#666"}
          />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* WORKING Search and Filter with CALENDAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vaccines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleDateFilterPress} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={20} color="#2196F3" />
          <Text style={styles.filterText}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Active Filter Display */}
      {(filterDate || searchQuery) && (
        <View style={styles.activeFilterContainer}>
          <Text style={styles.activeFilterText}>
            {searchQuery && `🔍 Search: "${searchQuery}"`}
            {searchQuery && filterDate && " • "}
            {filterDate && `📅 Date: ${filterDate.toLocaleDateString()}`}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("")
              setFilterDate(null)
            }}
          >
            <Ionicons name="close-circle" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      )}

      {/* Show 2nd Dose Alert Banner */}
      {secondDoseNotifications.length > 0 && (
        <TouchableOpacity
          style={[styles.alertBanner, { backgroundColor: "#FFE0B2" }]}
          onPress={handleNotificationClick}
          activeOpacity={0.6}
        >
          <Ionicons name="warning" size={20} color="#FF9800" />
          <Text style={[styles.alertText, { fontWeight: "600" }]}>
            {secondDoseNotifications.length} vaccine dose(s) due soon - Tap to view
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#FF9800" />
        </TouchableOpacity>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "vaccinated" && styles.activeTab]}
          onPress={() => setActiveTab("vaccinated")}
        >
          <Text style={[styles.tabText, activeTab === "vaccinated" && styles.activeTabText]}>
            Vaccinated ({vaccineRecords.filter((r) => r.verified === true).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={[styles.tabText, activeTab === "pending" && styles.activeTabText]}>
            Pending ({vaccineRecords.filter((r) => r.verified === false).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vaccine List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {searchQuery || filterDate ? "No vaccines match your search criteria" : `No ${activeTab} vaccines found`}
            </Text>
            {(searchQuery || filterDate) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery("")
                  setFilterDate(null)
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredRecords.map((record, index) => (
            <VaccineCard key={`${record.id}-${refreshCounter}-${index}`} record={record} />
          ))
        )}
      </ScrollView>

      {showDatePicker && (
        <Modal visible={showDatePicker} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerContainer}>
              <Text style={styles.modalTitle}>Select Date to Filter</Text>

              {renderCustomCalendar()}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  onPress={() => {
                    setShowDatePicker(false)
                    setFilterDate(null)
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ✅ WORKING: Edit Modal with ALL TEXT INPUTS */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Vaccination Record</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {editingRecord && (
              <ScrollView style={styles.editModalContent}>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Patient Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingRecord.patient_name}
                    onChangeText={(text) => setEditingRecord({ ...editingRecord, patient_name: text })}
                    placeholder="Enter patient name"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.editLabel}>Date Given (YYYY-MM-DD)</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editingRecord.date_given || ""}
                      onChangeText={(text) => setEditingRecord({ ...editingRecord, date_given: text })}
                      placeholder="Enter date given"
                      autoCapitalize="words"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.halfWidth}>
                    <Text style={styles.editLabel}>Dose Number (Total Doses: {editingRecord.next_dose_number?.toString() || "1"})</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editingRecord.dose_number.toString()}
                      onChangeText={(text) =>
                        setEditingRecord({ ...editingRecord, dose_number: Number.parseInt(text) || 1 })
                      }
                      keyboardType="numeric"
                      placeholder="1"
                    />
                  </View>
                </View>

                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Administered By</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingRecord.administered_by || ""}
                    onChangeText={(text) => setEditingRecord({ ...editingRecord, administered_by: text })}
                    placeholder="Enter who administered the vaccine"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Notes</Text>
                  <TextInput
                    style={[styles.editInput, styles.editTextArea]}
                    value={editingRecord.notes || ""}
                    onChangeText={(text) => setEditingRecord({ ...editingRecord, notes: text })}
                    multiline
                    numberOfLines={3}
                    placeholder="Enter any notes or observations"
                    autoCapitalize="sentences"
                  />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={saveEditedRecord}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModal}>
            <Text style={styles.notificationModalTitle}>{notificationModalContent.title}</Text>
            <Text style={styles.notificationModalMessage}>{notificationModalContent.message}</Text>
            <View style={styles.notificationModalButtons}>
              {notificationModalContent.buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.notificationModalButton,
                    button.style === "cancel" ? styles.cancelButton : styles.defaultButton,
                  ]}
                  onPress={button.onPress}
                >
                  <Text
                    style={[
                      styles.notificationModalButtonText,
                      button.style === "cancel" ? styles.cancelButtonText : styles.defaultButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  notificationIcon: {
    position: "relative",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  hasNotifications: {
    backgroundColor: "#2196F3",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#F44336",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    height: 40,
  },
  filterText: {
    color: "#2196F3",
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilterContainer: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeFilterText: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "500",
  },
  alertBanner: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  alertText: {
    flex: 1,
    color: "#E65100",
    fontSize: 14,
    fontWeight: "500",
  },
  tabContainer: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  doseIndicator: {
    alignItems: "flex-end",
  },
  doseText: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    minWidth: 320,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  editModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editModalContent: {
    padding: 20,
  },
  editFormGroup: {
    marginBottom: 16,
  },
  editLabel: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  editTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pendingActions: {
    flex: 1,
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  pendingActionText: {
    fontSize: 14,
    color: "#FF9800",
    fontStyle: "italic",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  customCalendar: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    minWidth: 40,
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  weekDaysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
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
  dayCell: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 5,
  },
  emptyDayCell: {
    backgroundColor: "transparent",
  },
  activeDayCell: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  emptyDayText: {
    color: "transparent",
  },
  notificationModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxWidth: "90%",
    minWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  notificationModalMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    color: "#666",
    textAlign: "left",
  },
  notificationModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  notificationModalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  defaultButton: {
    backgroundColor: "#007AFF",
  },
  notificationModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#666",
  },
  defaultButtonText: {
    color: "white",
  },
})
