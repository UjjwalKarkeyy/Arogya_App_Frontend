import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Question } from "../SurveyBuilder";

export default function QuestionItem({
  question,
  index,
  isActive,
  onPress,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  question: Question;
  index: number;
  isActive: boolean;
  onPress: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.item, isActive && styles.active]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading} numberOfLines={1}>
          Question {index} • {question.type}
        </Text>
        <Text style={styles.title} numberOfLines={1}>{question.title}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.iconBtn} onPress={onMoveUp}><Text>↑</Text></Pressable>
        <Pressable style={styles.iconBtn} onPress={onMoveDown}><Text>↓</Text></Pressable>
        <Pressable style={[styles.iconBtn, styles.danger]} onPress={onDelete}><Text style={{color:"#fff"}}>🗑</Text></Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  active: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  heading: { fontWeight: "800", marginBottom: 2 },
  title: { color: "#111827" },
  actions: { flexDirection: "row", gap: 6, marginLeft: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  danger: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
});