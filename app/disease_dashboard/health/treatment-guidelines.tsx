import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TreatmentGuidelines() {
  const router = useRouter();

  const treatmentCategories = [
    {
      id: 1,
      title: 'Seasonal Flu',
      severity: 'High',
      color: '#ef4444',
      icon: 'thermometer',
      guidelines: [
        'Rest and stay hydrated with plenty of fluids',
        'Take over-the-counter fever reducers (paracetamol)',
        'Use throat lozenges for sore throat relief',
        'Avoid aspirin in children and teenagers',
        'Seek medical attention if symptoms worsen after 3 days'
      ],
      warning: 'Consult doctor immediately if experiencing difficulty breathing or chest pain'
    },
    {
      id: 2,
      title: 'Common Cold',
      severity: 'Low',
      color: '#10b981',
      icon: 'nose',
      guidelines: [
        'Get plenty of rest and sleep',
        'Drink warm liquids like tea, soup, or warm water',
        'Use saline nasal drops for congestion',
        'Gargle with warm salt water for sore throat',
        'Use a humidifier to ease breathing'
      ],
      warning: 'See a doctor if symptoms persist for more than 10 days'
    },
    {
      id: 3,
      title: 'Dengue Fever',
      severity: 'Critical',
      color: '#dc2626',
      icon: 'bug',
      guidelines: [
        'Maintain adequate fluid intake to prevent dehydration',
        'Take paracetamol for fever (avoid aspirin and ibuprofen)',
        'Monitor platelet count regularly',
        'Watch for warning signs of severe dengue',
        'Immediate hospitalization may be required'
      ],
      warning: 'Emergency care needed for severe abdominal pain, persistent vomiting, or bleeding'
    },
    {
      id: 4,
      title: 'Gastroenteritis',
      severity: 'Medium',
      color: '#f59e0b',
      icon: 'medical',
      guidelines: [
        'Stay hydrated with ORS (Oral Rehydration Solution)',
        'Eat bland foods like rice, bananas, and toast',
        'Avoid dairy products and fatty foods',
        'Take probiotics to restore gut bacteria',
        'Rest and avoid strenuous activities'
      ],
      warning: 'Seek medical help for severe dehydration or blood in stool'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return '#dc2626';
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return Colors.textSecondary;
    }
  };

  const TreatmentCard = ({ treatment }: { treatment: typeof treatmentCategories[0] }) => (
    <View style={styles.treatmentCard}>
      <View style={styles.treatmentHeader}>
        <View style={styles.treatmentInfo}>
          <View style={styles.titleRow}>
            <View style={[styles.treatmentIcon, { backgroundColor: treatment.color + '20' }]}>
              <Ionicons name={treatment.icon as any} size={20} color={treatment.color} />
            </View>
            <Text style={styles.treatmentTitle}>{treatment.title}</Text>
          </View>
          <View style={styles.severityBadge}>
            <View style={[styles.severityDot, { backgroundColor: getSeverityColor(treatment.severity) }]} />
            <Text style={[styles.severityText, { color: getSeverityColor(treatment.severity) }]}>
              {treatment.severity} Priority
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.guidelinesSection}>
        <Text style={styles.sectionTitle}>Treatment Guidelines:</Text>
        {treatment.guidelines.map((guideline, index) => (
          <View key={index} style={styles.guidelineItem}>
            <Text style={styles.guidelineNumber}>{index + 1}.</Text>
            <Text style={styles.guidelineText}>{guideline}</Text>
          </View>
        ))}
      </View>

      <View style={styles.warningSection}>
        <View style={styles.warningHeader}>
          <Ionicons name="warning" size={16} color={Colors.error} />
          <Text style={styles.warningTitle}>Important Warning</Text>
        </View>
        <Text style={styles.warningText}>{treatment.warning}</Text>
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
          <Text style={styles.headerTitle}>Treatment Guidelines</Text>
        </View>

        <View style={styles.content}>
          {/* Disclaimer */}
          <View style={styles.disclaimerCard}>
            <View style={styles.disclaimerIcon}>
              <Ionicons name="information-circle" size={24} color={Colors.warning} />
            </View>
            <View style={styles.disclaimerContent}>
              <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
              <Text style={styles.disclaimerText}>
                These guidelines are for informational purposes only. Always consult with a qualified healthcare professional for proper diagnosis and treatment.
              </Text>
            </View>
          </View>

          {/* Treatment Categories */}
          {treatmentCategories.map((treatment) => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="call" size={20} color={Colors.error} />
              <Text style={styles.emergencyTitle}>Emergency Medical Services</Text>
            </View>
            <View style={styles.emergencyNumbers}>
              <Text style={styles.emergencyNumber}>Ambulance: 102</Text>
              <Text style={styles.emergencyNumber}>Police: 100</Text>
              <Text style={styles.emergencyNumber}>Fire: 101</Text>
            </View>
          </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 16,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  disclaimerIcon: {
    marginRight: 12,
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  treatmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
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
  treatmentHeader: {
    marginBottom: 16,
  },
  treatmentInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  treatmentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 44,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  guidelinesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guidelineNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginRight: 8,
    minWidth: 20,
  },
  guidelineText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  warningSection: {
    backgroundColor: Colors.error + '05',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 6,
  },
  warningText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  emergencyCard: {
    backgroundColor: Colors.error + '10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    marginTop: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  emergencyNumbers: {
    gap: 4,
  },
  emergencyNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.error,
  },
});
