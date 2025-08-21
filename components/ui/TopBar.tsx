import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

export const TopBar = ({ onPreview, onSave }: { onPreview: () => void; onSave: () => void }) => {
  return (
    <View style={styles.bar}>
      <Text style={styles.title} numberOfLines={1}>Survey Form Builder</Text>
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.ghost]} onPress={onPreview}>
          <Text style={styles.ghostText}>Preview</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={onSave}>
          <Text style={styles.primaryText}>Save Form</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    minHeight: 56,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "700", flex: 1 },
  actions: { flexDirection: "row", gap: 8 },
  btn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: { backgroundColor: "#F3F4F6" },
  ghostText: { fontWeight: "700", color: "#111827" },
  btnPrimary: { backgroundColor: "#111827", paddingHorizontal: 16, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#fff", fontWeight: "700" },
});