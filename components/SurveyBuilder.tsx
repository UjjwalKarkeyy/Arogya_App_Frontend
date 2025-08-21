import React, { useMemo, useState } from "react";

import axios from "axios";
import {
  Alert, StyleSheet, View, useWindowDimensions, ScrollView,
  Modal, SafeAreaView, Pressable, Text
} from "react-native";
import { useRouter } from "expo-router";
import { API_ENDPOINTS } from "../config/healthApi";
import FormSettings from "./ui/FormSettings";
import AddQuestion from "./ui/AddQuestion";
import QuestionList from "./ui/QuestionList";
import QuestionSettings from "./ui/QuestionSettings";
import { TopBar } from "./ui/TopBar";
import FormPreview from "./ui/FormPreview";

export type QuestionType =
  | "Short Text" | "Long Text" | "Multiple Choice" | "Rating Scale" | "Yes/No" | "Date" | "Number";

export type Question = {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  scaleMax?: number;
};

export default function SurveyBuilder() {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState("Patient Satisfaction Survey");
  const [formDesc, setFormDesc] = useState("Please help us improve our services by completing this survey.");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q1", type: "Number", title: "what", required: false },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>("q1");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedSurveyName, setSavedSurveyName] = useState("");
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const selected = useMemo(
    () => questions.find((q) => q.id === selectedId) ?? null,
    [questions, selectedId]
  );

  const addQuestion = (type: QuestionType) => {
    const base: Question = { id: `${Date.now()}`, type, title: "New Question", required: false };
    const withDefaults: Question =
      type === "Multiple Choice" ? { ...base, options: ["Option 1", "Option 2"] } :
      type === "Rating Scale" ? { ...base, scaleMax: 5 } : base;

    setQuestions((prev) => [...prev, withDefaults]);
    setSelectedId(withDefaults.id);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const move = (id: string, dir: "up" | "down") => {
    setQuestions((prev) => {
      const i = prev.findIndex((q) => q.id === id);
      if (i < 0) return prev;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // PREVIEW
  const onPreview = () => setShowPreview(true);


const onSave = async () => {
  try {
    const payload = {
      name: formTitle.trim(),
      description: formDesc.trim(),
      questions,
    };

    console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));
    console.log("API endpoint:", API_ENDPOINTS.SURVEYS);

    // Send to backend
    const response = await axios.post(API_ENDPOINTS.SURVEYS, payload);

    if (response.status === 201 || response.status === 200) {
      setSavedSurveyName(formTitle.trim());
      setShowSuccess(true);
    } else {
      Alert.alert("Save failed", "Unexpected response from server.");
    }
  } catch (e: any) {
    console.error("Save error details:", e);
    let errorMessage = "Unknown error occurred";
    
    if (e.response) {
      // Server responded with error status
      console.error("Error response:", e.response.data);
      console.error("Error status:", e.response.status);
      errorMessage = `Server error (${e.response.status}): ${JSON.stringify(e.response.data)}`;
    } else if (e.request) {
      // Request was made but no response received
      errorMessage = "No response from server. Check if backend is running.";
    } else {
      // Something else happened
      errorMessage = e.message || String(e);
    }
    
    Alert.alert("Save failed", errorMessage);
  }
};


  return (
    <View style={styles.root}>
      <TopBar onPreview={onPreview} onSave={onSave} />

      {isWide ? (
        <View style={styles.columns}>
          <View style={[styles.col, { flex: 1.2 }]}>
            <FormSettings
              title={formTitle}
              description={formDesc}
              onChangeTitle={setFormTitle}
              onChangeDescription={setFormDesc}
            />
            <AddQuestion onAdd={addQuestion} />
          </View>

          <View style={[styles.col, { flex: 1.8 }]}>
            <QuestionList
              questions={questions}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={deleteQuestion}
              onMove={move}
            />
          </View>

          <View style={[styles.col, { flex: 1.2 }]}>
            {selected && (
              <QuestionSettings key={selected.id} question={selected} onChange={updateQuestion} />
            )}
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.stack}>
          <FormSettings
            title={formTitle}
            description={formDesc}
            onChangeTitle={setFormTitle}
            onChangeDescription={setFormDesc}
          />
          <AddQuestion onAdd={addQuestion} />
          <QuestionList
            questions={questions}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={deleteQuestion}
            onMove={move}
          />
          {selected && (
            <QuestionSettings key={selected.id} question={selected} onChange={updateQuestion} />
          )}
        </ScrollView>
      )}

      {/* PREVIEW MODAL */}
      <Modal visible={showPreview} animationType="slide" onRequestClose={() => setShowPreview(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <FormPreview title={formTitle} description={formDesc} questions={questions} />
            <Pressable onPress={() => setShowPreview(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close Preview</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccess} animationType="fade" transparent onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Survey Saved Successfully!</Text>
            <Text style={styles.successMessage}>
              "{savedSurveyName}" has been saved to your surveys.
            </Text>
            <View style={styles.successButtons}>
              <Pressable 
                style={[styles.successBtn, styles.secondaryBtn]} 
                onPress={() => {
                  setShowSuccess(false);
                  // Reset form for new survey
                  setFormTitle("New Survey");
                  setFormDesc("");
                  setQuestions([{ id: `q${Date.now()}`, type: "Short Text", title: "New Question", required: false }]);
                  setSelectedId(null);
                }}
              >
                <Text style={styles.secondaryBtnText}>Create Another</Text>
              </Pressable>
              <Pressable 
                style={[styles.successBtn, styles.primaryBtn]} 
                onPress={() => {
                  setShowSuccess(false);
                  router.push("/surveyForm");
                }}
              >
                <Text style={styles.primaryBtnText}>View All Surveys</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: 12 },
  columns: { flex: 1, flexDirection: "row", gap: 12 },
  stack: { gap: 12, paddingBottom: 24 },
  col: { gap: 12 },
  closeBtn: {
    alignSelf: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeText: { color: "#fff", fontWeight: "700" },
  
  // Success Modal Styles
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  successButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  successBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#0ea5e9",
  },
  secondaryBtn: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtnText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 16,
  },
});

