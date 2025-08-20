import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CitySymptoms() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = Array.isArray(params.cityName) ? params.cityName[0] : params.cityName || 'Kathmandu';
  const season = Array.isArray(params.season) ? params.season[0] : params.season || 'Monsoon';

  const getCitySpecificData = (city: string, season: string) => {
    const baseData = {
      commonSymptoms: [
        'High fever (38°C/100°F or higher)',
        'Severe headache and muscle aches',
        'Sore throat and dry cough',
        'Nasal congestion and runny nose',
        'Fatigue and weakness'
      ],
      transmissionMethods: [
        'Airborne droplets from coughing/sneezing',
        'Direct contact with infected surfaces',
        'Close contact with infected individuals',
        'Contaminated food and water'
      ]
    };

    // City-specific variations
    const cityVariations: { [key: string]: any } = {
      'Kathmandu': {
        riskLevel: 'High',
        specificSymptoms: [...baseData.commonSymptoms, 'Respiratory distress due to air pollution'],
        localFactors: 'High population density and air pollution increase transmission risk',
        prevalence: '1,250 cases reported this month',
        hotspots: ['Thamel', 'New Road', 'Ratna Park', 'Basantapur']
      },
      'Pokhara': {
        riskLevel: 'Medium',
        specificSymptoms: [...baseData.commonSymptoms, 'Joint pain from humidity'],
        localFactors: 'Tourist areas and lake proximity affect humidity levels',
        prevalence: '680 cases reported this month',
        hotspots: ['Lakeside', 'Damside', 'Mahendrapul', 'Bagar']
      },
      'Chitwan': {
        riskLevel: 'High',
        specificSymptoms: [...baseData.commonSymptoms, 'Gastrointestinal symptoms from water contamination'],
        localFactors: 'Tropical climate and monsoon flooding increase disease spread',
        prevalence: '890 cases reported this month',
        hotspots: ['Bharatpur', 'Ratnanagar', 'Rapti', 'Narayangadh']
      },
      'Dharan': {
        riskLevel: 'Medium',
        specificSymptoms: [...baseData.commonSymptoms, 'Skin rashes from humidity'],
        localFactors: 'Hill station climate with seasonal temperature variations',
        prevalence: '420 cases reported this month',
        hotspots: ['BP Chowk', 'Ghopa', 'Pindeshwor', 'Bhanuchowk']
      },
      'Butwal': {
        riskLevel: 'High',
        specificSymptoms: [...baseData.commonSymptoms, 'Heat-related complications'],
        localFactors: 'Border town with high transit population',
        prevalence: '750 cases reported this month',
        hotspots: ['Traffic Chowk', 'Golpark', 'Kalikanagar', 'Devinagar']
      }
    };

    // Season-specific modifications
    const seasonModifications: { [key: string]: any } = {
      'Monsoon': {
        additionalSymptoms: ['Waterborne illness symptoms', 'Increased respiratory issues'],
        transmissionRisk: 'Very High - Flooding and contaminated water sources'
      },
      'Summer': {
        additionalSymptoms: ['Dehydration symptoms', 'Heat exhaustion'],
        transmissionRisk: 'High - Crowded indoor spaces with poor ventilation'
      },
      'Winter': {
        additionalSymptoms: ['Prolonged cough', 'Chest congestion'],
        transmissionRisk: 'High - Close indoor contact and poor air circulation'
      }
    };

    return {
      ...baseData,
      ...cityVariations[city],
      seasonalInfo: seasonModifications[season]
    };
  };

  const data = getCitySpecificData(cityName, season);

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Symptoms & Transmission</Text>
        </View>

        <View style={styles.content}>
          {/* City Info Card */}
          <View style={styles.cityCard}>
            <View style={styles.cityHeader}>
              <Text style={styles.cityName}>{cityName}</Text>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(data.riskLevel) + '20' }]}>
                <Text style={[styles.riskText, { color: getRiskColor(data.riskLevel) }]}>
                  {data.riskLevel} Risk
                </Text>
              </View>
            </View>
            <Text style={styles.prevalence}>{data.prevalence}</Text>
            <Text style={styles.localFactors}>{data.localFactors}</Text>
          </View>

          {/* Symptoms Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={20} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Common Symptoms in {cityName}</Text>
            </View>
            {data.specificSymptoms.map((symptom: string, index: number) => (
              <View key={index} style={styles.symptomItem}>
                <View style={styles.symptomBullet} />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>

          {/* Seasonal Symptoms */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="partly-sunny" size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>{season} Season Symptoms</Text>
            </View>
            {data.seasonalInfo.additionalSymptoms.map((symptom: string, index: number) => (
              <View key={index} style={styles.symptomItem}>
                <View style={[styles.symptomBullet, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>

          {/* Transmission Methods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="share" size={20} color="#8b5cf6" />
              <Text style={styles.sectionTitle}>How It Spreads</Text>
            </View>
            {data.transmissionMethods.map((method: string, index: number) => (
              <View key={index} style={styles.transmissionItem}>
                <Ionicons name="arrow-forward" size={16} color="#8b5cf6" />
                <Text style={styles.transmissionText}>{method}</Text>
              </View>
            ))}
          </View>

          {/* Risk Assessment */}
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Transmission Risk in {cityName}</Text>
            <Text style={styles.riskDescription}>{data.seasonalInfo.transmissionRisk}</Text>
          </View>

          {/* Hotspots */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color="#ef4444" />
              <Text style={styles.sectionTitle}>High-Risk Areas</Text>
            </View>
            <View style={styles.hotspotsGrid}>
              {data.hotspots.map((hotspot: string, index: number) => (
                <View key={index} style={styles.hotspotTag}>
                  <Text style={styles.hotspotText}>{hotspot}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="call" size={20} color={Colors.error} />
              <Text style={styles.emergencyTitle}>Report Symptoms</Text>
            </View>
            <Text style={styles.emergencyText}>Call 1115 if you experience severe symptoms</Text>
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
  cityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  prevalence: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
  },
  localFactors: {
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
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  symptomBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
    marginRight: 12,
    marginTop: 7,
  },
  symptomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  transmissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  transmissionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  riskCard: {
    backgroundColor: '#ef4444' + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  hotspotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hotspotTag: {
    backgroundColor: '#ef4444' + '10',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hotspotText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
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
    marginBottom: 6,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
