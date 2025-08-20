import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OutbreakData {
  id: number;
  disease: {
    name: string;
    severity_level: string;
  };
  district: {
    name: string;
    province: string;
    latitude: number;
    longitude: number;
  };
  total_cases: number;
  new_cases_24h: number;
  deaths: number;
  recovered: number;
  active_cases: number;
  last_updated: string;
  risk_level: string;
}

interface NationalStats {
  total_active_outbreaks: number;
  total_cases: number;
  new_cases_24h: number;
  total_deaths: number;
  total_recovered: number;
  most_affected_districts: string[];
}

interface DiseaseStats {
  name: string;
  total_cases: number;
  new_cases_24h: number;
  recovered: number;
  deaths: number;
  active_outbreaks: number;
  risk_level: string;
  affected_districts: string[];
}

export default function LiveTracker() {
  const router = useRouter();
  const [outbreakData, setOutbreakData] = useState<OutbreakData[]>([]);
  const [nationalStats, setNationalStats] = useState<NationalStats>({
    total_active_outbreaks: 0,
    total_cases: 0,
    new_cases_24h: 0,
    total_deaths: 0,
    total_recovered: 0,
    most_affected_districts: []
  });
  const [diseaseStats, setDiseaseStats] = useState<DiseaseStats[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const diseases = ['ALL', 'Dengue', 'Cholera', 'Typhoid', 'COVID-19', 'Influenza'];

  useEffect(() => {
    requestLocationPermission();
    fetchNationalOverview();
    fetchDiseaseStats();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setCurrentLocation({ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude });
        fetchLocationBasedOutbreaks(currentLocation.coords.latitude, currentLocation.coords.longitude);
      } else {
        Alert.alert(
          'Location Permission',
          'Location access is needed to show nearby outbreaks. You can still view national data.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationBasedOutbreaks = async (latitude: number, longitude: number) => {
    try {
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback location outbreaks data');
      // Fallback to mock data
      const fallbackData = [
        {
          id: 1,
          disease: {
            name: 'Dengue',
            severity_level: 'high'
          },
          district: {
            name: 'Colombo',
            province: 'Western Province',
            latitude: 6.9271,
            longitude: 79.8612
          },
          total_cases: 100,
          new_cases_24h: 10,
          deaths: 5,
          recovered: 50,
          active_cases: 45,
          last_updated: '2023-02-20',
          risk_level: 'high'
        },
        {
          id: 2,
          disease: {
            name: 'Cholera',
            severity_level: 'medium'
          },
          district: {
            name: 'Gampaha',
            province: 'Western Province',
            latitude: 7.0922,
            longitude: 79.9903
          },
          total_cases: 50,
          new_cases_24h: 5,
          deaths: 2,
          recovered: 20,
          active_cases: 28,
          last_updated: '2023-02-20',
          risk_level: 'medium'
        }
      ];
      setOutbreakData(fallbackData);
    }
  };

  const fetchNationalOverview = async () => {
    try {
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback national overview data');
      // Fallback to mock data
      const fallbackData = {
        total_active_outbreaks: 100,
        total_cases: 500,
        new_cases_24h: 50,
        total_deaths: 20,
        total_recovered: 300,
        most_affected_districts: ['Colombo', 'Gampaha', 'Kandy']
      };
      setNationalStats(fallbackData);
    }
  };

  const fetchDiseaseStats = async () => {
    try {
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback disease stats data');
      // Use mock disease statistics
      const mockDiseaseStats = [
        {
          name: 'Dengue',
          total_cases: 456,
          new_cases_24h: 12,
          recovered: 300,
          deaths: 8,
          active_outbreaks: 3,
          risk_level: 'high',
          affected_districts: ['Kathmandu', 'Pokhara']
        },
        {
          name: 'COVID-19',
          total_cases: 234,
          new_cases_24h: 5,
          recovered: 200,
          deaths: 4,
          active_outbreaks: 2,
          risk_level: 'medium',
          affected_districts: ['Chitwan', 'Lalitpur']
        },
        {
          name: 'Cholera',
          total_cases: 89,
          new_cases_24h: 2,
          recovered: 70,
          deaths: 1,
          active_outbreaks: 1,
          risk_level: 'low',
          affected_districts: ['Bhaktapur']
        }
      ];
      setDiseaseStats(mockDiseaseStats);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return '#DC2626'; // Red
      case 'medium':
        return '#F59E0B'; // Yellow
      case 'low':
        return '#059669'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  const getRiskLevelBgColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return '#FEE2E2'; // Light Red
      case 'medium':
        return '#FEF3C7'; // Light Yellow
      case 'low':
        return '#D1FAE5'; // Light Green
      default:
        return '#F3F4F6'; // Light Gray
    }
  };

  const getDiseaseIcon = (diseaseName: string) => {
    switch (diseaseName.toLowerCase()) {
      case 'dengue':
        return 'bug';
      case 'cholera':
        return 'water';
      case 'typhoid':
        return 'thermometer';
      case 'covid-19':
        return 'shield';
      case 'influenza':
        return 'medical';
      default:
        return 'medical-outline';
    }
  };

  const filteredOutbreaks = selectedDisease === 'ALL' 
    ? outbreakData 
    : outbreakData.filter(outbreak => outbreak.disease.name === selectedDisease);

  const selectedDiseaseStats = diseaseStats.find(stats => stats.name === selectedDisease);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Loading disease data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="analytics" size={24} color="#1E40AF" />
          <Text style={styles.headerTitle}>Live Disease Tracker</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={() => {
            if (location) {
              fetchLocationBasedOutbreaks(location.coords.latitude, location.coords.longitude);
            }
            fetchNationalOverview();
            fetchDiseaseStats();
          }}>
          <Ionicons name="refresh" size={20} color="#1E40AF" />
        </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* National Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>National Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{nationalStats.total_active_outbreaks}</Text>
              <Text style={styles.statLabel}>Active Outbreaks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{nationalStats.total_cases.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Cases</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#DC2626' }]}>
                +{nationalStats.new_cases_24h}
              </Text>
              <Text style={styles.statLabel}>New Cases (24h)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#059669' }]}>
                {nationalStats.total_recovered.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Recovered</Text>
            </View>
          </View>
        </View>

        {/* Disease Tabs */}
        <View style={styles.tabsCard}>
          <Text style={styles.cardTitle}>Disease Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            {diseases.map((disease) => (
              <TouchableOpacity
                key={disease}
                style={[
                  styles.diseaseTab,
                  selectedDisease === disease && styles.diseaseTabActive
                ]}
                onPress={() => setSelectedDisease(disease)}
              >
                <Ionicons 
                  name={getDiseaseIcon(disease) as any} 
                  size={20} 
                  color={selectedDisease === disease ? '#fff' : '#1E40AF'} 
                />
                <Text style={[
                  styles.diseaseTabText,
                  selectedDisease === disease && styles.diseaseTabTextActive
                ]}>
                  {disease}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected Disease Statistics */}
        {selectedDisease !== 'ALL' && selectedDiseaseStats && (
          <View style={styles.diseaseStatsCard}>
            <View style={styles.diseaseHeader}>
              <View style={styles.diseaseInfo}>
                <Ionicons 
                  name={getDiseaseIcon(selectedDisease) as any} 
                  size={32} 
                  color={getRiskLevelColor(selectedDiseaseStats.risk_level)} 
                />
                <View style={styles.diseaseDetails}>
                  <Text style={styles.diseaseTitle}>{selectedDisease}</Text>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskLevelColor(selectedDiseaseStats.risk_level) }
                  ]}>
                    <Text style={styles.riskText}>{selectedDiseaseStats.risk_level.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.diseaseStatsGrid}>
              <View style={styles.diseaseStatItem}>
                <Text style={styles.diseaseStatNumber}>{selectedDiseaseStats.total_cases}</Text>
                <Text style={styles.diseaseStatLabel}>Total Cases</Text>
              </View>
              <View style={styles.diseaseStatItem}>
                <Text style={[styles.diseaseStatNumber, { color: '#DC2626' }]}>
                  +{selectedDiseaseStats.new_cases_24h}
                </Text>
                <Text style={styles.diseaseStatLabel}>New (24h)</Text>
              </View>
              <View style={styles.diseaseStatItem}>
                <Text style={[styles.diseaseStatNumber, { color: '#059669' }]}>
                  {selectedDiseaseStats.recovered}
                </Text>
                <Text style={styles.diseaseStatLabel}>Recovered</Text>
              </View>
              <View style={styles.diseaseStatItem}>
                <Text style={styles.diseaseStatNumber}>{selectedDiseaseStats.active_outbreaks}</Text>
                <Text style={styles.diseaseStatLabel}>Outbreaks</Text>
              </View>
            </View>
            
            <View style={styles.affectedDistricts}>
              <Text style={styles.affectedTitle}>Affected Districts</Text>
              <Text style={styles.affectedList}>
                {selectedDiseaseStats.affected_districts.slice(0, 5).join(', ')}
                {selectedDiseaseStats.affected_districts.length > 5 && ` +${selectedDiseaseStats.affected_districts.length - 5} more`}
              </Text>
            </View>
          </View>
        )}

        {/* Location Status Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Ionicons 
              name={locationPermission ? "location" : "location-outline"} 
              size={24} 
              color={locationPermission ? "#059669" : "#F59E0B"} 
            />
            <Text style={styles.locationTitle}>
              {locationPermission ? "Location Detected" : "Location Access Needed"}
            </Text>
          </View>
          <Text style={styles.locationText}>
            {locationPermission 
              ? `Showing outbreaks near your location`
              : "Enable location to see nearby outbreaks"
            }
          </Text>
          {!locationPermission && (
            <TouchableOpacity 
              style={styles.enableLocationButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.enableLocationText}>Enable Location</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Outbreak List */}
        <View style={styles.outbreaksCard}>
          <Text style={styles.cardTitle}>
            {selectedDisease === 'ALL' 
              ? (locationPermission ? "Nearby Outbreaks" : "Recent Outbreaks")
              : `${selectedDisease} Outbreaks`
            }
          </Text>
          
          {filteredOutbreaks.length > 0 ? (
            filteredOutbreaks.map((outbreak) => (
              <View key={outbreak.id} style={[
                styles.outbreakItem,
                { backgroundColor: getRiskLevelBgColor(outbreak.risk_level) }
              ]}>
                <View style={styles.outbreakHeader}>
                  <View style={styles.outbreakIconContainer}>
                    <Ionicons 
                      name={getDiseaseIcon(outbreak.disease.name) as any} 
                      size={24} 
                      color={getRiskLevelColor(outbreak.risk_level)} 
                    />
                  </View>
                  <View style={styles.outbreakInfo}>
                    <Text style={styles.outbreakDisease}>{outbreak.disease.name}</Text>
                    <Text style={styles.outbreakLocation}>
                      {outbreak.district.name}, {outbreak.district.province}
                    </Text>
                  </View>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskLevelColor(outbreak.risk_level) }
                  ]}>
                    <Text style={styles.riskText}>{outbreak.risk_level.toUpperCase()}</Text>
                  </View>
                </View>
                
                <View style={styles.outbreakStats}>
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>{outbreak.total_cases}</Text>
                    <Text style={styles.statKey}>Total Cases</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statValue, { color: '#DC2626' }]}>
                      +{outbreak.new_cases_24h}
                    </Text>
                    <Text style={styles.statKey}>New (24h)</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statValue, { color: '#059669' }]}>
                      {outbreak.recovered}
                    </Text>
                    <Text style={styles.statKey}>Recovered</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>{outbreak.active_cases}</Text>
                    <Text style={styles.statKey}>Active</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
              <Text style={styles.noDataText}>No outbreak data available</Text>
              <Text style={styles.noDataSubtext}>
                {selectedDisease === 'ALL'
                  ? (locationPermission 
                      ? "No outbreaks detected in your area" 
                      : "Enable location to see nearby outbreaks")
                  : `No ${selectedDisease} outbreaks found`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  map: {
    flex: 1,
  },
  outbreaksCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outbreakItem: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  outbreakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  outbreakInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  outbreakStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statPair: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  statKey: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Disease Tabs Styles
  tabsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabsScroll: {
    flexDirection: 'row',
  },
  diseaseTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    gap: 8,
  },
  diseaseTabActive: {
    backgroundColor: '#1E40AF',
  },
  diseaseTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  diseaseTabTextActive: {
    color: '#fff',
  },
  // Disease Statistics Styles
  diseaseStatsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  diseaseHeader: {
    marginBottom: 20,
  },
  diseaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  diseaseDetails: {
    flex: 1,
    gap: 8,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  diseaseStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  diseaseStatItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  diseaseStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 4,
  },
  diseaseStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  affectedDistricts: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  affectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  affectedList: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  // Location Card Styles
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  enableLocationButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  enableLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Updated Outbreak Styles
  outbreakIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  outbreakDisease: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  outbreakLocation: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statRow: {
    alignItems: 'center',
    flex: 1,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
});
