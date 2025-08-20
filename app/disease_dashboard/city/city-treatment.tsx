import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CityTreatment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = Array.isArray(params.cityName) ? params.cityName[0] : params.cityName || 'Kathmandu';
  const season = Array.isArray(params.season) ? params.season[0] : params.season || 'Monsoon';

  const getCitySpecificTreatment = (city: string, season: string) => {
    const baseTreatment = {
      immediate: [
        'Rest and stay hydrated',
        'Take paracetamol for fever',
        'Monitor symptoms closely',
        'Isolate from others'
      ],
      supportive: [
        'Maintain fluid intake',
        'Use throat lozenges',
        'Apply warm compresses',
        'Get adequate sleep'
      ]
    };

    const citySpecific: { [key: string]: any } = {
      'Kathmandu': {
        hospitalCapacity: 'High - Multiple tertiary care centers available',
        specialConsiderations: [
          'Air pollution may worsen respiratory symptoms',
          'Higher risk of secondary bacterial infections',
          'ICU beds available at major hospitals',
          'Oxygen therapy readily available'
        ],
        availableFacilities: [
          'TU Teaching Hospital - 24/7 Emergency',
          'Norvic International - Private ICU',
          'Grande International - Specialized care',
          'Bir Hospital - Government facility'
        ],
        medicineAvailability: 'Excellent - All medications readily available',
        emergencyResponse: '102 Ambulance - Average response 15 minutes'
      },
      'Pokhara': {
        hospitalCapacity: 'Moderate - Regional medical center',
        specialConsiderations: [
          'Tourist area with international medical standards',
          'Altitude considerations for some patients',
          'Good air quality aids recovery',
          'Limited ICU capacity during peak season'
        ],
        availableFacilities: [
          'Manipal Hospital - 24/7 Emergency',
          'Western Regional Hospital - Government',
          'Gandaki Medical College - Teaching hospital',
          'Fishtail Hospital - Private care'
        ],
        medicineAvailability: 'Good - Most medications available',
        emergencyResponse: '102 Ambulance - Average response 20 minutes'
      },
      'Chitwan': {
        hospitalCapacity: 'Moderate - Regional facilities with referral system',
        specialConsiderations: [
          'Tropical climate may prolong recovery',
          'Higher risk of complications from humidity',
          'Monsoon flooding may affect access',
          'Vector-borne disease co-infections possible'
        ],
        availableFacilities: [
          'Bharatpur Hospital - Regional center',
          'Chitwan Medical College - Teaching hospital',
          'College of Medical Sciences - Private',
          'District Hospital - Government'
        ],
        medicineAvailability: 'Good - Regional distribution center',
        emergencyResponse: '102 Ambulance - Average response 25 minutes'
      },
      'Dharan': {
        hospitalCapacity: 'Good - Specialized medical institute',
        specialConsiderations: [
          'Hill climate beneficial for respiratory recovery',
          'Temperature variations require monitoring',
          'Limited specialist availability',
          'Referral to Kathmandu for complex cases'
        ],
        availableFacilities: [
          'BP Koirala Institute - Specialized care',
          'Dharan Hospital - Regional center',
          'Nobel Medical College - Private',
          'Eastern Regional Hospital - Government'
        ],
        medicineAvailability: 'Good - Regional medical hub',
        emergencyResponse: '102 Ambulance - Average response 18 minutes'
      },
      'Butwal': {
        hospitalCapacity: 'Moderate - Border town medical facilities',
        specialConsiderations: [
          'Cross-border medical protocols',
          'Industrial pollution may affect recovery',
          'High patient volume from surrounding areas',
          'Referral system to Kathmandu available'
        ],
        availableFacilities: [
          'Lumbini Medical College - Teaching hospital',
          'Universal Medical College - Private',
          'Butwal Hospital - Regional center',
          'District Hospital - Government'
        ],
        medicineAvailability: 'Good - Border trade advantages',
        emergencyResponse: '102 Ambulance - Average response 22 minutes'
      }
    };

    const seasonalTreatment: { [key: string]: any } = {
      'Monsoon': {
        priority: 'Prevent Secondary Infections',
        modifications: [
          'Extra attention to wound care due to humidity',
          'Antifungal precautions for skin conditions',
          'Dehydration monitoring during flooding',
          'Vector-borne disease screening'
        ],
        complications: 'Higher risk of bacterial and fungal infections'
      },
      'Summer': {
        priority: 'Heat Management',
        modifications: [
          'Increased fluid replacement therapy',
          'Cooling measures for fever management',
          'Heat stroke prevention protocols',
          'Electrolyte balance monitoring'
        ],
        complications: 'Dehydration and heat-related complications'
      },
      'Winter': {
        priority: 'Respiratory Support',
        modifications: [
          'Enhanced respiratory care protocols',
          'Pneumonia prevention measures',
          'Vitamin D supplementation',
          'Indoor air quality management'
        ],
        complications: 'Respiratory complications and pneumonia risk'
      }
    };

    return {
      ...baseTreatment,
      ...citySpecific[city],
      seasonal: seasonalTreatment[season]
    };
  };

  const data = getCitySpecificTreatment(cityName, season);

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
          {/* City Treatment Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Ionicons name="medical" size={24} color={Colors.primary} />
              <Text style={styles.overviewTitle}>{cityName} Treatment Capacity</Text>
            </View>
            <Text style={styles.capacityText}>{data.hospitalCapacity}</Text>
            <Text style={styles.responseText}>{data.emergencyResponse}</Text>
          </View>

          {/* Seasonal Treatment Priority */}
          <View style={styles.priorityCard}>
            <Text style={styles.priorityTitle}>{season} Season Treatment Focus</Text>
            <Text style={styles.priorityFocus}>{data.seasonal.priority}</Text>
            <Text style={styles.priorityComplications}>{data.seasonal.complications}</Text>
          </View>

          {/* Immediate Treatment */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={20} color="#ef4444" />
              <Text style={styles.sectionTitle}>Immediate Treatment</Text>
            </View>
            {data.immediate.map((treatment: string, index: number) => (
              <View key={index} style={styles.treatmentItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.treatmentText}>{treatment}</Text>
              </View>
            ))}
          </View>

          {/* Seasonal Modifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="partly-sunny" size={20} color="#f59e0b" />
              <Text style={styles.sectionTitle}>{season} Season Modifications</Text>
            </View>
            {data.seasonal.modifications.map((modification: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.listText}>{modification}</Text>
              </View>
            ))}
          </View>

          {/* City-Specific Considerations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>{cityName} Special Considerations</Text>
            </View>
            {data.specialConsiderations.map((consideration: string, index: number) => (
              <View key={index} style={styles.considerationItem}>
                <Ionicons name="information-circle" size={16} color="#3b82f6" />
                <Text style={styles.considerationText}>{consideration}</Text>
              </View>
            ))}
          </View>

          {/* Supportive Care */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Supportive Care</Text>
            </View>
            {data.supportive.map((care: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: '#10b981' }]} />
                <Text style={styles.listText}>{care}</Text>
              </View>
            ))}
          </View>

          {/* Available Facilities */}
          <View style={styles.facilitiesCard}>
            <View style={styles.facilitiesHeader}>
              <Ionicons name="business" size={20} color={Colors.primary} />
              <Text style={styles.facilitiesTitle}>Medical Facilities in {cityName}</Text>
            </View>
            {data.availableFacilities.map((facility: string, index: number) => (
              <View key={index} style={styles.facilityItem}>
                <Ionicons name="medical" size={14} color={Colors.primary} />
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>

          {/* Medicine Availability */}
          <View style={styles.medicineCard}>
            <View style={styles.medicineHeader}>
              <Ionicons name="medical" size={16} color="#8b5cf6" />
              <Text style={styles.medicineTitle}>Medicine Availability</Text>
            </View>
            <Text style={styles.medicineText}>{data.medicineAvailability}</Text>
          </View>

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
  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  capacityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  responseText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  priorityCard: {
    backgroundColor: '#f59e0b' + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  priorityFocus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 4,
  },
  priorityComplications: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginRight: 12,
    minWidth: 20,
  },
  treatmentText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 7,
  },
  listText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  considerationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  considerationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  facilitiesCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  facilitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  facilitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  facilityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  medicineCard: {
    backgroundColor: '#8b5cf6' + '10',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicineTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
    marginLeft: 6,
  },
  medicineText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emergencyCard: {
    backgroundColor: Colors.error + '10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  emergencyNumbers: {
    gap: 4,
  },
  emergencyNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.error,
  },
});
