import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MedicinePlan, database } from "../_lib/database";
import { globalStyles, colors } from "../_lib/styles";
import { cancelNotification } from "../_lib/notifications";

export default function InfoEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const planId = route.params?.planId as string;

  const [plan, setPlan] = React.useState<MedicinePlan | null>(null);

  React.useEffect(() => {
    const loadPlan = async () => {
      if (planId) {
        try {
          const allPlans = await database.getAllPlans();
          const loadedPlan = allPlans.find((p) => p.id === parseInt(planId));
          setPlan(loadedPlan || null);
        } catch (error) {
          console.error("Error loading plan:", error);
        }
      }
    };
    loadPlan();
  }, [planId]);

  if (!plan) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={globalStyles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    navigation.navigate("Plan", { plan: JSON.stringify(plan) });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Plan",
      `Are you sure you want to delete the plan for ${plan.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await database.deletePlan(plan.id!);
              await cancelNotification(`plan_${plan.id}`);
              Alert.alert("Success", "Medicine plan deleted successfully");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting plan:", error);
              Alert.alert("Error", "Failed to delete medicine plan");
            }
          },
        },
      ]
    );
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

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View style={[globalStyles.card, { marginBottom: 12 }]}>
      <View style={globalStyles.row}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={[globalStyles.cardSubtitle, { marginBottom: 4 }]}>
            {label}
          </Text>
          <Text style={globalStyles.cardTitle}>{value}</Text>
        </View>
      </View>
    </View>
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
                {plan.name}
              </Text>
            </View>
          </View>

          <ScrollView
            style={globalStyles.flex1}
            contentContainerStyle={globalStyles.p20}
          >
            <View
              style={[globalStyles.card, { marginBottom: 24, padding: 24 }]}
            >
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="medical" size={40} color={colors.white} />
                </View>
                <Text
                  style={[
                    globalStyles.cardTitle,
                    { fontSize: 24, textAlign: "center" },
                  ]}
                >
                  {plan.name}
                </Text>
                <Text
                  style={[
                    globalStyles.cardSubtitle,
                    { textAlign: "center", marginTop: 4 },
                  ]}
                >
                  {plan.dosage}
                </Text>
              </View>
            </View>

            <Text style={[globalStyles.label, globalStyles.mb16]}>
              Plan Details
            </Text>

            <InfoRow
              icon="time"
              label="Notification Time"
              value={plan.notificationTime}
            />

            <InfoRow
              icon="restaurant"
              label="Food Timing"
              value={formatFoodTiming(plan.foodTiming)}
            />

            <InfoRow
              icon="calendar"
              label="Duration"
              value={`${plan.duration} days`}
            />

            <InfoRow
              icon="notifications"
              label="Notifications"
              value={plan.notificationsEnabled ? "Enabled" : "Disabled"}
            />

            <View style={{ marginTop: 32 }}>
              <Pressable style={globalStyles.button} onPress={handleEdit}>
                <Text style={globalStyles.buttonText}>Edit Plan</Text>
              </Pressable>

              <Pressable
                style={[
                  globalStyles.secondaryButton,
                  { marginTop: 12, borderColor: colors.danger, borderWidth: 1 },
                ]}
                onPress={handleDelete}
              >
                <Text
                  style={[
                    globalStyles.secondaryButtonText,
                    { color: colors.danger },
                  ]}
                >
                  Delete Plan
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
  );
}
