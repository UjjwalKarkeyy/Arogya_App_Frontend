import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CityPreventive() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = Array.isArray(params.cityName) ? params.cityName[0] : params.cityName || 'Kathmandu';
  const season = Array.isArray(params.season) ? params.season[0] : params.season || 'Monsoon';

  const getCitySpecificPreventiveMeasures = (city: string, season: string) => {
    const baseMeasures = {
      personal: [
        'Wash hands frequently with soap and water',
        'Use alcohol-based hand sanitizer',
        'Wear masks in crowded places',
        'Maintain social distancing'
      ],
      environmental: [
        'Keep living spaces well-ventilated',
        'Clean and disinfect surfaces regularly',
        'Avoid crowded indoor spaces',
        'Dispose of waste properly'
      ]
    };

    const citySpecific: { [key: string]: any } = {
      'Kathmandu': {
        airQuality: 'Use N95 masks due to high air pollution levels',
        waterSafety: 'Boil water or use filtered water - municipal supply may be contaminated',
        crowdAvoidance: 'Avoid peak hours in Ratna Park, New Road, and Asan areas',
        localTips: [
          'Use air purifiers indoors during pollution peaks',
          'Avoid street food in tourist areas',
          'Keep windows closed during dust storms',
          'Use public transport during off-peak hours'
        ],
        vaccinationCenters: ['Bir Hospital', 'TU Teaching Hospital', 'Patan Hospital']
      },
      'Pokhara': {
        airQuality: 'Generally good air quality, standard masks sufficient',
        waterSafety: 'Lake water contamination risk - avoid direct contact',
        crowdAvoidance: 'Avoid crowded lakeside areas during tourist season',
        localTips: [
          'Be cautious around Phewa Lake during monsoon',
          'Tourist areas have higher transmission risk',
          'Mountain weather changes require warm clothing',
          'Use mosquito repellent near water bodies'
        ],
        vaccinationCenters: ['Manipal Hospital', 'Western Regional Hospital', 'Gandaki Medical College']
      },
      'Chitwan': {
        airQuality: 'Moderate air quality, dust masks recommended',
        waterSafety: 'High risk of waterborne diseases - strict water purification needed',
        crowdAvoidance: 'Avoid crowded markets in Bharatpur during peak hours',
        localTips: [
          'Extra protection against mosquito-borne diseases',
          'Avoid flood-prone areas during monsoon',
          'Wildlife area visits require special precautions',
          'Use insect repellent consistently'
        ],
        vaccinationCenters: ['Bharatpur Hospital', 'Chitwan Medical College', 'College of Medical Sciences']
      },
      'Dharan': {
        airQuality: 'Good air quality due to hill location',
        waterSafety: 'Mountain water sources generally safe but filter recommended',
        crowdAvoidance: 'Avoid BP Chowk area during market hours',
        localTips: [
          'Temperature variations require layered clothing',
          'Hill station humidity needs extra hygiene care',
          'Landslide season requires indoor precautions',
          'Monitor weather changes closely'
        ],
        vaccinationCenters: ['BP Koirala Institute', 'Dharan Hospital', 'Nobel Medical College']
      },
      'Butwal': {
        airQuality: 'Moderate air quality, industrial area precautions needed',
        waterSafety: 'Border town water safety concerns - use purified water',
        crowdAvoidance: 'Avoid Traffic Chowk and border areas during peak transit',
        localTips: [
          'Higher risk due to cross-border movement',
          'Industrial pollution requires respiratory protection',
          'Transit hub increases exposure risk',
          'Monitor health of travelers'
        ],
        vaccinationCenters: ['Lumbini Medical College', 'Universal Medical College', 'Butwal Hospital']
      }
    };

    const seasonalMeasures: { [key: string]: any } = {
      'Monsoon': {
        priority: 'Water and Vector Control',
        measures: [
          'Eliminate standing water to prevent mosquito breeding',
          'Use waterproof footwear to avoid contaminated water',
          'Keep emergency supplies for flooding',
          'Increase hygiene practices due to humidity'
        ],
        risks: 'Flooding increases waterborne disease risk'
      },
      'Summer': {
        priority: 'Heat and Dehydration Prevention',
        measures: [
          'Stay hydrated with clean water',
          'Avoid outdoor activities during peak heat',
          'Use cooling measures indoors',
          'Monitor for heat-related symptoms'
        ],
        risks: 'High temperatures increase indoor crowding'
      },
      'Winter': {
        priority: 'Respiratory Protection',
        measures: [
          'Ensure proper indoor heating and ventilation',
          'Wear warm clothing to prevent cold stress',
          'Avoid poorly ventilated indoor gatherings',
          'Monitor air quality during temperature inversions'
        ],
        risks: 'Poor ventilation increases transmission risk'
      }
    };

    return {
      ...baseMeasures,
      ...citySpecific[city],
      seasonal: seasonalMeasures[season]
    };
  };

  const data = getCitySpecificPreventiveMeasures(cityName, season);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preventive Measures</Text>
        </View>

        <View style={styles.content}>
          {/* City Alert Card */}
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.accent} />
              <Text style={styles.alertTitle}>{cityName} Prevention Guide</Text>
            </View>
            <Text style={styles.alertText}>
              Customized prevention measures for {cityName} during {season} season
            </Text>
          </View>

          {/* Seasonal Priority */}
          <View style={styles.priorityCard}>
            <Text style={styles.priorityTitle}>{season} Season Priority</Text>
            <Text style={styles.priorityFocus}>{data.seasonal.priority}</Text>
            <Text style={styles.priorityRisk}>{data.seasonal.risks}</Text>
          </View>

          {/* City-Specific Measures */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Local Precautions for {cityName}</Text>
            </View>
            
            <View style={styles.measureItem}>
              <Ionicons name="cloud" size={16} color="#6b7280" />
              <View style={styles.measureContent}>
                <Text style={styles.measureLabel}>Air Quality</Text>
                <Text style={styles.measureText}>{data.airQuality}</Text>
              </View>
            </View>

            <View style={styles.measureItem}>
              <Ionicons name="water" size={16} color="#6b7280" />
              <View style={styles.measureContent}>
                <Text style={styles.measureLabel}>Water Safety</Text>
                <Text style={styles.measureText}>{data.waterSafety}</Text>
              </View>
            </View>

            <View style={styles.measureItem}>
              <Ionicons name="people" size={16} color="#6b7280" />
              <View style={styles.measureContent}>
                <Text style={styles.measureLabel}>Crowd Avoidance</Text>
                <Text style={styles.measureText}>{data.crowdAvoidance}</Text>
              </View>
            </View>
          </View>

          {/* Seasonal Measures */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="partly-sunny" size={20} color="#f59e0b" />
              <Text style={styles.sectionTitle}>{season} Season Measures</Text>
            </View>
            {data.seasonal.measures.map((measure: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.listText}>{measure}</Text>
              </View>
            ))}
          </View>

          {/* Local Tips */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={20} color="#8b5cf6" />
              <Text style={styles.sectionTitle}>Local Tips for {cityName}</Text>
            </View>
            {data.localTips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#8b5cf6" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Personal Hygiene */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="hand-left" size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Personal Hygiene</Text>
            </View>
            {data.personal.map((measure: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: '#10b981' }]} />
                <Text style={styles.listText}>{measure}</Text>
              </View>
            ))}
          </View>

          {/* Environmental Safety */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="home" size={20} color="#ef4444" />
              <Text style={styles.sectionTitle}>Environmental Safety</Text>
            </View>
            {data.environmental.map((measure: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.listText}>{measure}</Text>
              </View>
            ))}
          </View>

          {/* Vaccination Centers */}
          <View style={styles.vaccinationCard}>
            <View style={styles.vaccinationHeader}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
              <Text style={styles.vaccinationTitle}>Vaccination Centers in {cityName}</Text>
            </View>
            <View style={styles.centersList}>
              {data.vaccinationCenters.map((center: string, index: number) => (
                <View key={index} style={styles.centerItem}>
                  <Ionicons name="location" size={14} color={Colors.primary} />
                  <Text style={styles.centerText}>{center}</Text>
                </View>
              ))}
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
  alertCard: {
    backgroundColor: Colors.accent + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
    marginLeft: 8,
  },
  alertText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  priorityCard: {
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
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  priorityFocus: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  priorityRisk: {
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
  measureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  measureContent: {
    flex: 1,
    marginLeft: 8,
  },
  measureLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  measureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
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
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  vaccinationCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vaccinationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  centersList: {
    gap: 8,
  },
  centerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
});
