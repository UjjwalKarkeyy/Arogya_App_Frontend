import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CityVaccination() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = Array.isArray(params.cityName) ? params.cityName[0] : params.cityName || 'Kathmandu';
  const season = Array.isArray(params.season) ? params.season[0] : params.season || 'Monsoon';

  const getCitySpecificVaccination = (city: string, season: string) => {
    const baseVaccines = [
      {
        name: 'Seasonal Influenza',
        type: 'Annual',
        effectiveness: '60-70%',
        duration: '6-12 months',
        priority: 'High'
      },
      {
        name: 'COVID-19 Booster',
        type: 'Booster',
        effectiveness: '85-95%',
        duration: '6-8 months',
        priority: 'High'
      }
    ];

    const citySpecific: { [key: string]: any } = {
      'Kathmandu': {
        vaccinationRate: '78% fully vaccinated',
        availability: 'Excellent - Multiple centers with walk-in availability',
        centers: [
          {
            name: 'TU Teaching Hospital',
            address: 'Maharajgunj',
            hours: '9:00 AM - 5:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Hepatitis A/B'],
            contact: '01-4412303'
          },
          {
            name: 'Bir Hospital',
            address: 'Mahaboudha',
            hours: '10:00 AM - 4:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Typhoid'],
            contact: '01-4221119'
          },
          {
            name: 'Patan Hospital',
            address: 'Lagankhel',
            hours: '9:00 AM - 5:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Japanese Encephalitis'],
            contact: '01-5522266'
          }
        ],
        specialPrograms: [
          'Free vaccination for elderly (65+)',
          'School vaccination programs',
          'Tourist vaccination services'
        ]
      },
      'Pokhara': {
        vaccinationRate: '72% fully vaccinated',
        availability: 'Good - Regional centers with appointment system',
        centers: [
          {
            name: 'Manipal Hospital',
            address: 'Phulbari',
            hours: '8:00 AM - 6:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Hepatitis A/B'],
            contact: '061-526416'
          },
          {
            name: 'Western Regional Hospital',
            address: 'Ramghat',
            hours: '10:00 AM - 4:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Typhoid'],
            contact: '061-520066'
          }
        ],
        specialPrograms: [
          'Tourist health packages',
          'Trekker vaccination services',
          'Seasonal worker programs'
        ]
      },
      'Chitwan': {
        vaccinationRate: '68% fully vaccinated',
        availability: 'Moderate - Regional distribution with mobile units',
        centers: [
          {
            name: 'Bharatpur Hospital',
            address: 'Bharatpur-10',
            hours: '9:00 AM - 5:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Japanese Encephalitis'],
            contact: '056-592066'
          },
          {
            name: 'Chitwan Medical College',
            address: 'Bharatpur-18',
            hours: '8:00 AM - 4:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Hepatitis A/B'],
            contact: '056-591333'
          }
        ],
        specialPrograms: [
          'Rural outreach programs',
          'Wildlife area worker vaccination',
          'Monsoon season mobile clinics'
        ]
      },
      'Dharan': {
        vaccinationRate: '75% fully vaccinated',
        availability: 'Good - Specialized medical institute coverage',
        centers: [
          {
            name: 'BP Koirala Institute',
            address: 'Dharan-18',
            hours: '9:00 AM - 5:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Hepatitis A/B', 'Typhoid'],
            contact: '025-525555'
          },
          {
            name: 'Nobel Medical College',
            address: 'Biratnagar Road',
            hours: '8:00 AM - 6:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Japanese Encephalitis'],
            contact: '025-525252'
          }
        ],
        specialPrograms: [
          'Hill region outreach',
          'Student vaccination programs',
          'Cross-border health initiatives'
        ]
      },
      'Butwal': {
        vaccinationRate: '70% fully vaccinated',
        availability: 'Good - Border town advantages with multiple suppliers',
        centers: [
          {
            name: 'Lumbini Medical College',
            address: 'Palpa Road',
            hours: '8:00 AM - 6:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Hepatitis A/B'],
            contact: '071-540001'
          },
          {
            name: 'Universal Medical College',
            address: 'Bhairahawa Road',
            hours: '9:00 AM - 5:00 PM',
            vaccines: ['Flu', 'COVID-19', 'Typhoid'],
            contact: '071-525252'
          }
        ],
        specialPrograms: [
          'Cross-border vaccination coordination',
          'Transit worker programs',
          'Industrial area health camps'
        ]
      }
    };

    const seasonalRecommendations: { [key: string]: any } = {
      'Monsoon': {
        priority: 'Vector-borne Disease Prevention',
        recommended: [
          'Japanese Encephalitis (high priority)',
          'Hepatitis A (water contamination risk)',
          'Typhoid (food/water safety)',
          'Seasonal Flu (respiratory infections)'
        ],
        timing: 'Get vaccinated before peak monsoon season'
      },
      'Summer': {
        priority: 'Travel and Heat-related Prevention',
        recommended: [
          'Seasonal Flu (indoor crowding)',
          'Hepatitis A/B (travel season)',
          'COVID-19 booster (tourist season)',
          'Meningitis (crowded conditions)'
        ],
        timing: 'Vaccinate 2-3 weeks before peak summer'
      },
      'Winter': {
        priority: 'Respiratory Disease Prevention',
        recommended: [
          'Seasonal Flu (highest priority)',
          'Pneumococcal (elderly/high-risk)',
          'COVID-19 booster (indoor transmission)',
          'Whooping cough (respiratory season)'
        ],
        timing: 'Early winter vaccination recommended'
      }
    };

    return {
      baseVaccines,
      ...citySpecific[city],
      seasonal: seasonalRecommendations[season]
    };
  };

  const data = getCitySpecificVaccination(cityName, season);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
          <Text style={styles.headerTitle}>Vaccination Information</Text>
        </View>

        <View style={styles.content}>
          {/* City Vaccination Status */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.accent} />
              <Text style={styles.statusTitle}>{cityName} Vaccination Status</Text>
            </View>
            <Text style={styles.vaccinationRate}>{data.vaccinationRate}</Text>
            <Text style={styles.availabilityText}>{data.availability}</Text>
          </View>

          {/* Seasonal Recommendations */}
          <View style={styles.seasonalCard}>
            <Text style={styles.seasonalTitle}>{season} Season Priority</Text>
            <Text style={styles.seasonalPriority}>{data.seasonal.priority}</Text>
            <Text style={styles.seasonalTiming}>{data.seasonal.timing}</Text>
          </View>

          {/* Recommended Vaccines */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical" size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Recommended for {season}</Text>
            </View>
            {data.seasonal.recommended.map((vaccine: string, index: number) => (
              <View key={index} style={styles.vaccineItem}>
                <View style={styles.vaccineBullet} />
                <Text style={styles.vaccineText}>{vaccine}</Text>
              </View>
            ))}
          </View>

          {/* Available Vaccines */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={20} color="#8b5cf6" />
              <Text style={styles.sectionTitle}>Available Vaccines</Text>
            </View>
            {data.baseVaccines.map((vaccine: any, index: number) => (
              <View key={index} style={styles.vaccineCard}>
                <View style={styles.vaccineHeader}>
                  <Text style={styles.vaccineName}>{vaccine.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(vaccine.priority) + '20' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(vaccine.priority) }]}>
                      {vaccine.priority}
                    </Text>
                  </View>
                </View>
                <View style={styles.vaccineDetails}>
                  <Text style={styles.vaccineDetail}>Type: {vaccine.type}</Text>
                  <Text style={styles.vaccineDetail}>Effectiveness: {vaccine.effectiveness}</Text>
                  <Text style={styles.vaccineDetail}>Duration: {vaccine.duration}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Vaccination Centers */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Vaccination Centers in {cityName}</Text>
            </View>
            {data.centers.map((center: any, index: number) => (
              <View key={index} style={styles.centerCard}>
                <View style={styles.centerHeader}>
                  <Text style={styles.centerName}>{center.name}</Text>
                  <TouchableOpacity style={styles.callButton}>
                    <Ionicons name="call" size={16} color={Colors.surface} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.centerAddress}>{center.address}</Text>
                <Text style={styles.centerHours}>Hours: {center.hours}</Text>
                <Text style={styles.centerContact}>Contact: {center.contact}</Text>
                <View style={styles.vaccinesList}>
                  <Text style={styles.vaccinesLabel}>Available:</Text>
                  <Text style={styles.vaccinesText}>{center.vaccines.join(', ')}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Special Programs */}
          <View style={styles.programsCard}>
            <View style={styles.programsHeader}>
              <Ionicons name="star" size={20} color="#f59e0b" />
              <Text style={styles.programsTitle}>Special Programs in {cityName}</Text>
            </View>
            {data.specialPrograms.map((program: string, index: number) => (
              <View key={index} style={styles.programItem}>
                <Ionicons name="checkmark-circle" size={16} color="#f59e0b" />
                <Text style={styles.programText}>{program}</Text>
              </View>
            ))}
          </View>

          {/* Important Notes */}
          <View style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <Ionicons name="information-circle" size={20} color={Colors.warning} />
              <Text style={styles.notesTitle}>Important Notes</Text>
            </View>
            <Text style={styles.noteText}>• Bring valid ID and vaccination card</Text>
            <Text style={styles.noteText}>• Some vaccines require advance booking</Text>
            <Text style={styles.noteText}>• Side effects monitoring for 15-30 minutes</Text>
            <Text style={styles.noteText}>• Consult doctor for high-risk conditions</Text>
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
  statusCard: {
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  vaccinationRate: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.accent,
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  seasonalCard: {
    backgroundColor: '#3b82f6' + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  seasonalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  seasonalPriority: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  seasonalTiming: {
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
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vaccineBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 12,
    marginTop: 7,
  },
  vaccineText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  vaccineCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  vaccineDetails: {
    gap: 2,
  },
  vaccineDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  centerCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  centerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  callButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  centerHours: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  centerContact: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 6,
  },
  vaccinesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vaccinesLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 4,
  },
  vaccinesText: {
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
  },
  programsCard: {
    backgroundColor: '#f59e0b' + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b' + '30',
  },
  programsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  programsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
    marginLeft: 8,
  },
  programItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  programText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  notesCard: {
    backgroundColor: Colors.warning + '10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 8,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 2,
  },
});
