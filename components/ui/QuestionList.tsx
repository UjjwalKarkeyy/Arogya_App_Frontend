import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import QuestionItem from "./QuestionItem";
import type { Question } from "../SurveyBuilder";

export default function QuestionList({
  questions,
  selectedId,
  onSelect,
  onDelete,
  onMove,
}: {
  questions: Question[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
}) {
  return (
    <View style={styles.card}>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        {questions.map((q, i) => (
          <QuestionItem
            key={q.id}
            index={i + 1}
            question={q}
            isActive={selectedId === q.id}
            onPress={() => onSelect(q.id)}
            onDelete={() => onDelete(q.id)}
            onMoveUp={() => onMove(q.id, "up")}
            onMoveDown={() => onMove(q.id, "down")}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
});