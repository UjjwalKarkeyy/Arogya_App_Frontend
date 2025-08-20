import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OutbreakData {
  id: number;
  disease: {
    name: string;
    severity_level: string;
  };
  district: {
    name: string;
    province: string;
  };
  total_cases: number;
  new_cases_24h: number;
  deaths: number;
  recovered: number;
  active_cases: number;
  risk_level: string;
  status: string;
  affected_areas: string;
  last_updated: string;
}

export default function OutbreakDetails() {
  const {
    disease = 'Dengue',
    date = 'August 13, 2025',
    riskLevel = 'HIGH',
    totalCases = '156',
    newCases = '12',
    area = 'Bagmati',
  } = useLocalSearchParams();

  const router = useRouter();
  const [outbreaks, setOutbreaks] = useState<OutbreakData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchOutbreaks();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchOutbreaks = async () => {
    try {
      setLoading(true);
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback outbreaks data');
      const data = [
        {
          id: 1,
          disease: {
            name: 'Dengue',
            severity_level: 'HIGH',
          },
          district: {
            name: 'Kathmandu',
            province: 'Bagmati',
          },
          total_cases: 100,
          new_cases_24h: 10,
          deaths: 5,
          recovered: 50,
          active_cases: 45,
          risk_level: 'HIGH',
          status: 'ACTIVE',
          affected_areas: 'Kathmandu, Lalitpur',
          last_updated: '2023-02-20T14:30:00',
        },
        {
          id: 2,
          disease: {
            name: 'COVID-19',
            severity_level: 'MODERATE',
          },
          district: {
            name: 'Bhaktapur',
            province: 'Bagmati',
          },
          total_cases: 50,
          new_cases_24h: 5,
          deaths: 2,
          recovered: 20,
          active_cases: 28,
          risk_level: 'MODERATE',
          status: 'CONTAINED',
          affected_areas: 'Bhaktapur, Madhyapur Thimi',
          last_updated: '2023-02-20T14:30:00',
        },
      ];
      setOutbreaks(data);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOutbreaks();
    } finally {
      setRefreshing(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return '#DC2626';
      case 'HIGH':
        return '#EA580C';
      case 'MODERATE':
        return '#D97706';
      case 'LOW':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const getRiskLevelBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return '#FEE2E2';
      case 'HIGH':
        return '#FED7AA';
      case 'MODERATE':
        return '#FEF3C7';
      case 'LOW':
        return '#D1FAE5';
      default:
        return '#F3F4F6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#DC2626';
      case 'CONTAINED':
        return '#D97706';
      case 'RESOLVED':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading outbreak data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outbreak Details</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color="#1E40AF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {/* Featured Alert */}
          <View style={[styles.featuredCard, { backgroundColor: getRiskLevelBgColor(riskLevel as string) }]}>
            <View style={styles.featuredHeader}>
              <View style={[styles.riskIcon, { backgroundColor: getRiskLevelColor(riskLevel as string) }]}>
                <Ionicons name="warning" size={24} color="#fff" />
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>{disease} Outbreak</Text>
                <Text style={styles.featuredLocation}>{area} Province</Text>
                <Text style={styles.featuredDate}>Last updated: {date}</Text>
              </View>
              <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(riskLevel as string) }]}>
                <Text style={styles.riskText}>{riskLevel}</Text>
              </View>
            </View>

            <View style={styles.featuredStats}>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: getRiskLevelColor(riskLevel as string) }]}>
                  {totalCases}
                </Text>
                <Text style={styles.statLabel}>Total Cases</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: '#DC2626' }]}>+{newCases}</Text>
                <Text style={styles.statLabel}>New (24h)</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: '#059669' }]}>
                  {Math.floor(parseInt(Array.isArray(totalCases) ? totalCases[0] : totalCases) * 0.7)}
                </Text>
                <Text style={styles.statLabel}>Recovered</Text>
              </View>
            </View>
          </View>

          {/* All Outbreaks List */}
          <View style={styles.outbreaksCard}>
            <Text style={styles.cardTitle}>All Active Outbreaks</Text>
            
            {outbreaks.length > 0 ? (
              outbreaks.map((outbreak) => (
                <View key={outbreak.id} style={styles.outbreakItem}>
                  <View style={styles.outbreakHeader}>
                    <View style={styles.outbreakMainInfo}>
                      <Text style={styles.diseaseName}>{outbreak.disease.name}</Text>
                      <Text style={styles.locationText}>
                        {outbreak.district.name}, {outbreak.district.province}
                      </Text>
                    </View>
                    <View style={styles.outbreakBadges}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(outbreak.status) }
                      ]}>
                        <Text style={styles.statusText}>{outbreak.status}</Text>
                      </View>
                      <View style={[
                        styles.riskBadgeSmall,
                        { backgroundColor: getRiskLevelBgColor(outbreak.risk_level) }
                      ]}>
                        <Text style={[
                          styles.riskTextSmall,
                          { color: getRiskLevelColor(outbreak.risk_level) }
                        ]}>
                          {outbreak.risk_level}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.outbreakStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{outbreak.total_cases}</Text>
                      <Text style={styles.statKey}>Total</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: '#DC2626' }]}>
                        +{outbreak.new_cases_24h}
                      </Text>
                      <Text style={styles.statKey}>New</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: '#059669' }]}>
                        {outbreak.recovered}
                      </Text>
                      <Text style={styles.statKey}>Recovered</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: '#6B7280' }]}>
                        {outbreak.deaths}
                      </Text>
                      <Text style={styles.statKey}>Deaths</Text>
                    </View>
                  </View>

                  <Text style={styles.affectedAreas} numberOfLines={2}>
                    Affected areas: {outbreak.affected_areas}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
                <Text style={styles.noDataText}>No active outbreaks</Text>
                <Text style={styles.noDataSubtext}>All areas are currently safe</Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsCard}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('./safetytips')}
              >
                <Ionicons name="shield-checkmark" size={20} color="#059669" />
                <Text style={styles.actionButtonText}>Safety Tips</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('./livetracker')}
              >
                <Ionicons name="location" size={20} color="#1E40AF" />
                <Text style={styles.actionButtonText}>Live Tracker</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call" size={20} color="#DC2626" />
                <Text style={styles.actionButtonText}>Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  featuredCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  riskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  featuredDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  featuredStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
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
  outbreakMainInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  outbreakBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  riskBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskTextSmall: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  outbreakStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  statKey: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  affectedAreas: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    fontStyle: 'italic',
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
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
