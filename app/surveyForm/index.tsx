import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { surveyApi } from "../../config/healthApi";

interface Survey {
  id: string;
  name: string;
  description: string;
  questions: any[];
  created_at?: string;
  updated_at?: string;
}

export default function HomeTab() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSurveys = async () => {
    try {
      const data = await surveyApi.getSurveys();
      console.log('Fetched surveys:', data);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setSurveys(data);
      } else if (data.results && Array.isArray(data.results)) {
        setSurveys(data.results);
      } else if (data.data && Array.isArray(data.data)) {
        setSurveys(data.data);
      } else {
        console.warn('Unexpected surveys response format:', data);
        setSurveys([]);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
      Alert.alert('Error', 'Failed to load surveys');
      setSurveys([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurveys();
  };

  const renderSurveyItem = ({ item }: { item: Survey }) => (
    <View style={styles.surveyCard}>
      <Text style={styles.surveyName}>{item.name}</Text>
      <Text style={styles.surveyDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.surveyMeta}>
        <Text style={styles.questionCount}>
          {item.questions?.length || 0} questions
        </Text>
        {item.created_at && (
          <Text style={styles.createdDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Survey Management</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Loading surveys...</Text>
        </View>
      ) : (
        <>
          {surveys.length > 0 ? (
            <View style={styles.surveysSection}>
              <Text style={styles.sectionTitle}>Your Surveys</Text>
              <FlatList
                data={surveys}
                renderItem={renderSurveyItem}
                keyExtractor={(item) => item.id}
                style={styles.surveysList}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No surveys created yet</Text>
              <Text style={styles.emptySubtext}>Create your first survey to get started</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.primary}
            onPress={() => router.push("./surveyForm/builder")}
          >
            <Text style={styles.primaryText}>+ Create New Survey</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F6F8", 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "800", 
    marginBottom: 24, 
    textAlign: "center",
    color: "#111827"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500"
  },
  surveysSection: {
    flex: 1,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827"
  },
  surveysList: {
    flex: 1
  },
  surveyCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  surveyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6
  },
  surveyDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12
  },
  surveyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  questionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0ea5e9",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  createdDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500"
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center"
  },
  primary: { 
    backgroundColor: "#0ea5e9", 
    paddingVertical: 16, 
    paddingHorizontal: 24, 
    borderRadius: 12, 
    alignItems: "center",
    shadowColor: "#0ea5e9",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4
  },
  primaryText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  }
});