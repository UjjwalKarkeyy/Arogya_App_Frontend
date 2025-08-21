import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Switch, Pressable, FlatList } from "react-native";
import type { Question } from "../SurveyBuilder";

export default function QuestionSettings({
  question,
  onChange,
}: {
  question: Question;
  onChange: (id: string, patch: Partial<Question>) => void;
}) {
  const [local, setLocal] = useState<Question>(question);

  const push = <K extends keyof Question>(key: K, value: Question[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    onChange(question.id, { [key]: value } as Partial<Question>);
  };

  const addOption = () => {
    const next = [...(local.options ?? []), `Option ${((local.options ?? []).length + 1)}`];
    push("options", next);
  };

  const setOption = (i: number, v: string) => {
    const next = [...(local.options ?? [])];
    next[i] = v;
    push("options", next);
  };

  const removeOption = (i: number) => {
    const next = [...(local.options ?? [])];
    next.splice(i, 1);
    push("options", next);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Question Settings</Text>

      <Text style={styles.label}>Question Title</Text>
      <TextInput
        value={local.title}
        onChangeText={(t) => push("title", t)}
        style={styles.input}
        placeholder="New Question"
      />

      <Text style={[styles.label, { marginTop: 8 }]}>Description (optional)</Text>
      <TextInput
        value={local.description ?? ""}
        onChangeText={(t) => push("description", t)}
        style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
        placeholder="Add helpful context or instructions…"
        multiline
      />

      <View style={styles.row}>
        <Text style={{ fontWeight: "700" }}>Required Question</Text>
        <Switch value={local.required} onValueChange={(v) => push("required", v)} />
      </View>

      {local.type === "Multiple Choice" && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.subTitle}>Options</Text>
          <FlatList
            data={local.options ?? []}
            keyExtractor={(_, i) => String(i)}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item, index }) => (
              <View style={styles.optionRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={item}
                  onChangeText={(t) => setOption(index, t)}
                />
                <Pressable style={[styles.smBtn, styles.danger]} onPress={() => removeOption(index)}>
                  <Text style={{ color: "#fff", fontWeight: "800" }}>Delete</Text>
                </Pressable>
              </View>
            )}
            ListFooterComponent={
              <Pressable style={styles.smBtn} onPress={addOption}>
                <Text style={{ fontWeight: "800" }}>Add Option</Text>
              </Pressable>
            }
          />
        </View>
      )}

      {local.type === "Rating Scale" && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.subTitle}>Scale Maximum</Text>
          <TextInput
            keyboardType="number-pad"
            value={String(local.scaleMax ?? 5)}
            onChangeText={(t) => push("scaleMax", Math.max(2, Number(t || 5)))}
            style={[styles.input, { width: 110 }]}
          />
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
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  title: { fontSize: 16, fontWeight: "800" },
  subTitle: { fontWeight: "800", marginBottom: 6 },
  label: { fontWeight: "700" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  smBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
  },
  danger: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
});