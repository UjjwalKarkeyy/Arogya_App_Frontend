import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function FormSettings({
  title,
  description,
  onChangeTitle,
  onChangeDescription,
}: {
  title: string;
  description: string;
  onChangeTitle: (v: string) => void;
  onChangeDescription: (v: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Form Settings</Text>

      <Text style={styles.label}>Form Title</Text>
      <TextInput
        value={title}
        onChangeText={onChangeTitle}
        placeholder="Form title"
        style={styles.input}
      />

      <Text style={[styles.label, { marginTop: 10 }]}>Description</Text>
      <TextInput
        value={description}
        onChangeText={onChangeDescription}
        placeholder="Describe your form"
        style={[styles.input, styles.textarea]}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  label: { fontWeight: "700" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },
});