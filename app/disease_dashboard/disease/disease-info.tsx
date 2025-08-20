import { Colors } from '@/constants/Colors';
import { mockData } from '@/constants/Data';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InfoSectionProps = {
  title: string;
  items: string[];
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

export default function DiseaseInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const diseaseData = mockData.diseases['Seasonal Flu'];

  const InfoSection = ({ title, items, icon, iconColor }: InfoSectionProps) => (
    <View style={styles.infoSection}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.itemsList}>
        {items.map((item: string, index: number) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seasonal Flu and Viral Infections</Text>
        </View>

        <View style={styles.content}>
          {/* Symptoms Section */}
          <InfoSection
            title="Symptoms"
            items={diseaseData.symptoms}
            icon="warning"
            iconColor="#f59e0b"
          />

          {/* Preventive Measures Section */}
          <InfoSection
            title="Preventive Measures"
            items={diseaseData.preventiveMeasures}
            icon="shield-checkmark"
            iconColor="#10b981"
          />

          {/* Treatment Guidelines Section */}
          <InfoSection
            title="Treatment Guidelines"
            items={diseaseData.treatmentGuidelines}
            icon="medkit"
            iconColor="#3b82f6"
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 16,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  itemsList: {
    paddingLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: 8,
    marginTop: 2,
  },
  itemText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
});
