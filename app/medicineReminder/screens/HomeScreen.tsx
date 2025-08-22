import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { database, MedicinePlan } from "../_lib/database";
import { globalStyles, colors } from "../_lib/styles";
import {
  scheduleNotification,
  cancelNotification,
  processDailyMedicationUpdates,
} from "../_lib/notifications";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [plans, setPlans] = useState<MedicinePlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlans, setFilteredPlans] = useState<MedicinePlan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlans = async () => {
    try {
      const allPlans = await database.getAllPlans();
      setPlans(allPlans);
      setFilteredPlans(allPlans);
    } catch (error) {
      console.error("Error loading plans:", error);
      Alert.alert("Error", "Failed to load medicine plans");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Process daily medication updates first
    await processDailyMedicationUpdates();
    // Then reload plans to show updated durations
    await loadPlans();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter((plan) =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  }, [searchQuery, plans]);

  const toggleNotifications = async (plan: MedicinePlan) => {
    try {
      const newStatus = !plan.notificationsEnabled;
      await database.toggleNotifications(plan.id!, newStatus);

      if (newStatus) {
        await scheduleNotification(
          `plan_${plan.id}`,
          "Medicine Reminder",
          `Time to take your ${plan.name} (${plan.dosage})`,
          plan.notificationTime
        );
      } else {
        await cancelNotification(`plan_${plan.id}`);
      }

      await loadPlans();
    } catch (error) {
      console.error("Error toggling notifications:", error);
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  const navigateToPlan = () => {
    navigation.navigate("Plan");
  };

  const navigateToInfo = (plan: MedicinePlan) => {
    navigation.navigate("InfoEdit", { planId: plan.id?.toString() });
  };

  const formatFoodTiming = (timing: string) => {
    switch (timing) {
      case "before":
        return "Before meals";
      case "after":
        return "After meals";
      case "during":
        return "During meals";
      default:
        return timing;
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <View style={globalStyles.p20}>
          <Text style={globalStyles.greeting}>Hello, Username</Text>

          {/* Medicine Reminder Header */}
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              marginVertical: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="medical" size={24} color={colors.white} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Medicine Reminder
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  opacity: 0.9,
                  marginTop: 2,
                }}
              >
                Stay healthy, take your medicines on time
              </Text>
            </View>
            <Ionicons name="heart" size={20} color={colors.white} />
          </View>

          {/* Quick Stats */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: colors.success + "20",
                borderRadius: 8,
                padding: 12,
                flex: 1,
                marginRight: 8,
                alignItems: "center",
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text
                style={{
                  color: colors.success,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 4,
                }}
              >
                {filteredPlans.filter((p) => p.duration === 0).length}
              </Text>
              <Text
                style={{
                  color: colors.success,
                  fontSize: 12,
                }}
              >
                Completed
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.primary + "20",
                borderRadius: 8,
                padding: 12,
                flex: 1,
                marginLeft: 8,
                alignItems: "center",
              }}
            >
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 4,
                }}
              >
                {
                  filteredPlans.filter(
                    (p) => p.duration > 0 && p.notificationsEnabled
                  ).length
                }
              </Text>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 12,
                }}
              >
                Active
              </Text>
            </View>
          </View>

          <TextInput
            style={globalStyles.searchBar}
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <ScrollView
          style={globalStyles.flex1}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={[globalStyles.label, globalStyles.mb16]}>
            Daily Review
          </Text>

          {filteredPlans.length === 0 ? (
            <View style={globalStyles.card}>
              <Text
                style={[globalStyles.cardSubtitle, globalStyles.textCenter]}
              >
                {searchQuery
                  ? "No plans match your search"
                  : "No medicine plans yet. Tap + to add one."}
              </Text>
            </View>
          ) : (
            filteredPlans.map((plan) => (
              <Pressable
                key={plan.id}
                style={globalStyles.card}
                onPress={() => navigateToInfo(plan)}
                android_ripple={{ color: colors.gray100 }}
              >
                <View style={globalStyles.row}>
                  <View style={globalStyles.flex1}>
                    <View style={globalStyles.row}>
                      <Ionicons
                        name="medical"
                        size={20}
                        color={colors.primary}
                        style={{ marginRight: 8 }}
                      />
                      <View style={globalStyles.flex1}>
                        <Text style={globalStyles.cardTitle}>{plan.name}</Text>
                        <Text style={globalStyles.cardSubtitle}>
                          {plan.notificationTime}
                        </Text>
                      </View>
                    </View>
                    <Text style={[globalStyles.cardSubtitle, { marginTop: 4 }]}>
                      {plan.dosage} • {formatFoodTiming(plan.foodTiming)} •{" "}
                      {plan.duration} days
                      {plan.duration === 0 && (
                        <Text
                          style={{ color: colors.success, fontWeight: "bold" }}
                        >
                          {" "}
                          • Completed!
                        </Text>
                      )}
                    </Text>
                  </View>
                  <Switch
                    value={plan.notificationsEnabled}
                    onValueChange={() => toggleNotifications(plan)}
                    trackColor={{ false: colors.gray300, true: colors.primary }}
                    thumbColor={colors.white}
                  />
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        <Pressable
          style={globalStyles.centerFloatingButton}
          onPress={navigateToPlan}
          android_ripple={{ color: "#172554", borderless: false }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
