import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Question } from "../SurveyBuilder";

export default function FormPreview({
  title, 
  description,
  questions,
}: {
  title: string;
  description: string;
  questions: Question[];
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.desc}>{description}</Text>}

      {questions.map((q, i) => (
        <View key={q.id} style={styles.qCard}>
          <Text style={styles.qTitle}>
            {i + 1}. {q.title} {q.required ? "*" : ""}
          </Text>
          {q.description ? <Text style={styles.qDesc}>{q.description}</Text> : null}

          {/* very light “input” mocks */}
          {q.type === "Short Text" && <View style={styles.input} />}
          {q.type === "Long Text" && <View style={[styles.input, { height: 100 }]} />}
          {q.type === "Number" && <View style={styles.input} />}
          {q.type === "Date" && <View style={styles.input} />}
          {q.type === "Yes/No" && <Text style={styles.helper}>Options: Yes / No</Text>}
          {q.type === "Multiple Choice" && (
            <Text style={styles.helper}>
              {`Options: ${(q.options ?? []).join(", ") || "Option 1, Option 2"}`}
            </Text>
          )}
          {q.type === "Rating Scale" && (
            <Text style={styles.helper}>Scale: 1 – {q.scaleMax ?? 5}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  title: { fontSize: 20, fontWeight: "800" },
  desc: { color: "#374151", marginBottom: 8 },
  qCard: {
    borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff",
    borderRadius: 12, padding: 12, gap: 6,
  },
  qTitle: { fontWeight: "700" },
  qDesc: { color: "#4B5563" },
  input: {
    height: 44, borderWidth: 1, borderColor: "#E5E7EB",
    borderRadius: 10, backgroundColor: "#F9FAFB",
  },
  helper: { color: "#6B7280", fontStyle: "italic" },
});