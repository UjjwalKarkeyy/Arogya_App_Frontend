import React from "react";
import { View, ViewStyle } from "react-native";
import { NavigationIndependentTree } from "@react-navigation/native";
import App from "./App";

// Route entry for Medicine Reminder that safely consumes the style prop from Expo Router
export default function MedicineReminderEntry(props: { style?: ViewStyle }) {
  const { style } = props;
  return React.createElement(
    View,
    { style: [ { flex: 1 }, style ] },
    React.createElement(
      NavigationIndependentTree,
      null,
      React.createElement(App, null)
    )
  );
}
