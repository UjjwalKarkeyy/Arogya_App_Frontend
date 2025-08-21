import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SurveyBuilder from "../../components/SurveyBuilder";

export default function BuilderTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 12 }}>
        <SurveyBuilder />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6F8" },
});


