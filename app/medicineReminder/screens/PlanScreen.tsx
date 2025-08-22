import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { database, MedicinePlan } from "../_lib/database";
import { globalStyles, colors } from "../_lib/styles";
import {
  scheduleNotification,
  requestPermissions,
  cancelNotification,
} from "../_lib/notifications";

export default function PlanScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingPlan = route.params?.plan
    ? JSON.parse(route.params.plan as string)
    : null;
  const isEditing = !!editingPlan;

  const [medicineName, setMedicineName] = useState(editingPlan?.name || "");
  const [dosage, setDosage] = useState(editingPlan?.dosage || "");
  const [duration, setDuration] = useState(
    editingPlan?.duration?.toString() || ""
  );
  const [foodTiming, setFoodTiming] = useState<"before" | "after" | "during">(
    editingPlan?.foodTiming || "before"
  );
  const [notificationTime, setNotificationTime] = useState(
    editingPlan?.notificationTime || "10:00"
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime && event.type !== "dismissed") {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      setNotificationTime(`${hours}:${minutes}`);
    }
  };

  const getTimeFromString = (timeString: string): Date => {
    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        throw new Error("Invalid time format");
      }
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    } catch (error) {
      // Fallback to 10:00 AM if parsing fails
      const fallbackTime = new Date();
      fallbackTime.setHours(10, 0, 0, 0);
      return fallbackTime;
    }
  };

  const validateForm = (): boolean => {
    if (!medicineName.trim()) {
      Alert.alert("Error", "Please enter medicine name");
      return false;
    }
    if (!dosage.trim()) {
      Alert.alert("Error", "Please enter dosage");
      return false;
    }
    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert("Error", "Please enter valid duration in days");
      return false;
    }

    // Validate time format
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(notificationTime)) {
      Alert.alert("Error", "Please select a valid notification time");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const plan: MedicinePlan = {
        name: medicineName.trim(),
        dosage: dosage.trim(),
        duration: Number(duration),
        foodTiming,
        notificationTime: notificationTime.trim(),
        notificationsEnabled: true,
      };

      let planId: number;

      if (isEditing && editingPlan.id) {
        plan.id = editingPlan.id;
        planId = editingPlan.id;

        // Cancel existing notifications before updating
        await cancelNotification(`plan_${planId}`);
        await cancelNotification(`plan_${planId}_next`);

        // Update the plan in database
        await database.updatePlan(plan);
      } else {
        // Save new plan and get the ID
        planId = await database.savePlan(plan);
        plan.id = planId;
      }

      // Schedule the notification with the exact time
      await scheduleNotification(
        `plan_${planId}`,
        "Medicine Reminder",
        `Time to take your ${plan.name} (${plan.dosage}) ${plan.foodTiming} food`,
        plan.notificationTime
      );

      Alert.alert(
        "Success",
        `Medicine plan ${
          isEditing ? "updated" : "saved"
        } successfully.\nNotification scheduled for ${plan.notificationTime}`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving plan:", error);
      Alert.alert("Error", "Failed to save medicine plan. Please try again.");
    }
  };

  const FoodTimingButton = ({
    timing,
    label,
    icon,
  }: {
    timing: "before" | "after" | "during";
    label: string;
    icon: string;
  }) => (
    <Pressable
      style={[
        globalStyles.secondaryButton,
        {
          flex: 1,
          marginHorizontal: 4,
          backgroundColor:
            foodTiming === timing ? colors.primary : colors.gray100,
          paddingVertical: 20,
        },
      ]}
      onPress={() => setFoodTiming(timing)}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={foodTiming === timing ? colors.white : colors.textSecondary}
        style={{ marginBottom: 8 }}
      />
      <Text
        style={[
          globalStyles.secondaryButtonText,
          {
            color: foodTiming === timing ? colors.white : colors.text,
            fontSize: 12,
            textAlign: "center",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <View style={globalStyles.row}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
            <Text
              style={[globalStyles.headerTitle, { flex: 1, marginLeft: 16 }]}
            >
              {isEditing ? "Edit Plan" : "Add Plan"}
            </Text>
          </View>
        </View>

        <ScrollView
          style={globalStyles.flex1}
          contentContainerStyle={globalStyles.p20}
        >
          <Text style={globalStyles.label}>Medicine Name</Text>
          <TextInput
            style={globalStyles.input}
            value={medicineName}
            onChangeText={setMedicineName}
            placeholder="Paracetamol"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={globalStyles.label}>Amount & Duration (in days)</Text>
          <View style={[globalStyles.row, globalStyles.mb16]}>
            <View style={[globalStyles.flex1, { marginRight: 8 }]}>
              <TextInput
                style={globalStyles.input}
                value={dosage}
                onChangeText={setDosage}
                placeholder="2 pills"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={[globalStyles.flex1, { marginLeft: 8 }]}>
              <TextInput
                style={globalStyles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="30 days"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <Text style={globalStyles.label}>Food Timing</Text>
          <View style={[globalStyles.row, globalStyles.mb16]}>
            <FoodTimingButton
              timing="before"
              label="Before"
              icon="restaurant-outline"
            />
            <FoodTimingButton
              timing="during"
              label="During"
              icon="restaurant"
            />
            <FoodTimingButton timing="after" label="After" icon="restaurant" />
          </View>

          <Text style={globalStyles.label}>Notification</Text>
          <Pressable
            style={[globalStyles.input, globalStyles.row]}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="notifications" size={20} color={colors.primary} />
            <Text style={{ marginLeft: 12, fontSize: 16, color: colors.text }}>
              {notificationTime}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.textSecondary}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={getTimeFromString(notificationTime)}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </ScrollView>

        <View style={globalStyles.p20}>
          <Pressable style={globalStyles.button} onPress={handleSave}>
            <Text style={globalStyles.buttonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
