import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  requestPermissions,
  setupNotificationResponseListener,
  processDailyMedicationUpdates,
} from "./_lib/notifications";
import HomeScreen from "./screens/HomeScreen";
import PlanScreen from "./screens/PlanScreen";
import InfoEditScreen from "./screens/InfoEditScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize permissions notification listeners
    const initializeApp = async () => {
      await requestPermissions();

      // Set up notification response listener
      const subscription = setupNotificationResponseListener();

      // Process daily updates when app starts
      await processDailyMedicationUpdates();

      return subscription;
    };

    // Handle app state changes to process updates when app becomes active
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        // Process daily updates when app becomes active
        processDailyMedicationUpdates();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    let notificationSubscription: any;

    initializeApp().then((sub) => {
      notificationSubscription = sub;
    });

    // Cleanup function
    return () => {
      subscription?.remove();
      notificationSubscription?.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="InfoEdit" component={InfoEditScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
