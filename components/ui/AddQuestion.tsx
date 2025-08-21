// components/ui/AddQuestion.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Platform, ActionSheetIOS } from "react-native";
import type { QuestionType } from "../SurveyBuilder";

const TYPES: QuestionType[] = [
  "Short Text",
  "Long Text",
  "Multiple Choice",
  "Rating Scale",
  "Yes/No",
  "Date",
  "Number",
];

export default function AddQuestion({ onAdd }: { onAdd: (t: QuestionType) => void }) {
  const [open, setOpen] = useState(false);

  const selectType = (t: QuestionType) => {
    onAdd(t);
    setOpen(false);
  };

  // Optional: nice native sheet on iOS
  const openSheetIOS = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Add Question",
        options: [...TYPES, "Cancel"],
        cancelButtonIndex: TYPES.length,
      },
      (idx) => {
        if (idx >= 0 && idx < TYPES.length) selectType(TYPES[idx]);
      }
    );
  };

  const handleToggle = () => {
    if (Platform.OS === "ios") return openSheetIOS();
    setOpen((v) => !v);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add Question</Text>

      <Pressable style={styles.selector} onPress={handleToggle}>
        <Text style={styles.selectorText}>Select question type</Text>
        <Text style={styles.chev}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {/* Android & web dropdown panel (iOS uses native sheet above) */}
      {open && Platform.OS !== "ios" && (
        <View style={styles.dropdown}>
          <ScrollView contentContainerStyle={{ paddingVertical: 6 }}>
            {TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => selectType(t)}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              >
                <Text style={styles.optionText}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  title: { fontSize: 16, fontWeight: "800" },

  selector: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: { fontWeight: "700", color: "#111827" },
  chev: { fontSize: 12, opacity: 0.7 },

  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    maxHeight: 280,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  optionPressed: { backgroundColor: "#F3F4F6" },
  optionText: { fontWeight: "600", color: "#111827" },
});