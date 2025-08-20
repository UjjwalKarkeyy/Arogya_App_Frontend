import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

interface Alert {
  id: number;
  alert_type: string;
  disease_name: string;
  affected_areas: string[];
  total_cases?: number;
  severity?: string;
  message?: string;
  issued_date?: string;
}

interface NationalStats {
  total_active_outbreaks: number;
  total_cases: number;
  new_cases_24h?: number;
  total_deaths: number;
  total_recovered: number;
  mortality_rate?: number;
  recovery_rate?: number;
  last_updated?: string;
  most_affected_districts?: string[];
}

export default function Index() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [nationalStats, setNationalStats] = useState<NationalStats>({
    total_active_outbreaks: 12,
    total_cases: 1247,
    new_cases_24h: 45,
    total_deaths: 23,
    total_recovered: 1156,
    most_affected_districts: ['Kathmandu', 'Lalitpur'],
  });
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAlerts(), fetchNationalStats(), fetchRecentAlerts()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set fallback data to prevent crashes
      setNationalStats({
        total_active_outbreaks: 12,
        total_cases: 1247,
        new_cases_24h: 45,
        total_deaths: 23,
        total_recovered: 1156,
        most_affected_districts: ['Kathmandu', 'Lalitpur']
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback alerts data');
      // Fallback mock data
      setAlerts([
        {
          id: 1,
          alert_type: 'outbreak',
          disease_name: 'Dengue',
          affected_areas: ['Kathmandu', 'Lalitpur'],
          total_cases: 145,
          severity: 'high',
          message: 'Dengue outbreak reported in Kathmandu valley',
          issued_date: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchNationalStats = async () => {
    try {
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback national stats data');
      // Fallback to mock data
      setNationalStats({
        total_active_outbreaks: 12,
        total_cases: 1247,
        new_cases_24h: 45,
        total_deaths: 23,
        total_recovered: 1156,
        mortality_rate: 1.8,
        recovery_rate: 92.7,
        last_updated: new Date().toISOString(),
        most_affected_districts: ['Kathmandu', 'Lalitpur']
      });
    }
  };

  const fetchRecentAlerts = async () => {
    try {
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback recent alerts data');
      // Fallback to mock data
      setRecentAlerts([
        {
          id: 1,
          alert_type: 'critical',
          disease_name: 'Dengue',
          affected_areas: ['Kathmandu', 'Lalitpur'],
          total_cases: 245
        },
        {
          id: 2,
          alert_type: 'warning',
          disease_name: 'COVID-19',
          affected_areas: ['Pokhara'],
          total_cases: 89
        }
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={24} color="#1E40AF" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={32} color="#1E40AF" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Outbreak Alert Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color="#1E40AF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* National Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Ionicons name="stats-chart" size={24} color="#1E40AF" />
              <Text style={styles.cardTitle}>National Health Overview</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{nationalStats.total_active_outbreaks}</Text>
                <Text style={styles.statLabel}>Active Outbreaks</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{nationalStats.total_cases.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Cases</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: '#DC2626' }]}>
                  +{nationalStats.new_cases_24h || 0}
                </Text>
                <Text style={styles.statLabel}>New Cases (24h)</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: '#059669' }]}>
                  {nationalStats.total_recovered.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Recovered</Text>
              </View>
            </View>
          </View>

          {/* Live Disease Tracker Highlight */}
          <TouchableOpacity 
            style={styles.highlightCard}
            onPress={() => router.push('/outbreak/outbreak-alert/livetracker')}
            activeOpacity={0.7}
          >
            <View style={styles.highlightHeader}>
              <View style={[styles.highlightIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="analytics" size={32} color="#1E40AF" />
              </View>
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightTitle}>Live Disease Tracker</Text>
                <Text style={styles.highlightSubtitle}>Real-time monitoring & GPS tracking</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
            
            <View style={styles.highlightStats}>
              <View style={styles.highlightStatItem}>
                <Text style={styles.highlightStatNumber}>{nationalStats.total_active_outbreaks}</Text>
                <Text style={styles.highlightStatLabel}>Active Outbreaks</Text>
              </View>
              <View style={styles.highlightStatItem}>
                <Text style={[styles.highlightStatNumber, { color: '#DC2626' }]}>
                  +{nationalStats.new_cases_24h || 0}
                </Text>
                <Text style={styles.highlightStatLabel}>New Cases (24h)</Text>
              </View>
              <View style={styles.highlightStatItem}>
                <Text style={styles.highlightStatNumber}>6</Text>
                <Text style={styles.highlightStatLabel}>Disease Categories</Text>
              </View>
            </View>
            
            <View style={styles.highlightFeatures}>
              <Text style={styles.featureTag}>GPS Location</Text>
              <Text style={styles.featureTag}>Disease Filter</Text>
              <Text style={styles.featureTag}>Real-time Data</Text>
            </View>
          </TouchableOpacity>

          {/* Outbreak Details Highlight */}
          <TouchableOpacity 
            style={styles.highlightCard}
            onPress={() => router.push('/outbreak/outbreak-alert/outbreakdetails')}
            activeOpacity={0.7}
          >
            <View style={styles.highlightHeader}>
              <View style={[styles.highlightIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="warning" size={32} color="#DC2626" />
              </View>
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightTitle}>Outbreak Details</Text>
                <Text style={styles.highlightSubtitle}>Comprehensive outbreak information</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
            
            <View style={styles.highlightStats}>
              <View style={styles.highlightStatItem}>
                <Text style={styles.highlightStatNumber}>{nationalStats.total_cases.toLocaleString()}</Text>
                <Text style={styles.highlightStatLabel}>Total Cases</Text>
              </View>
              <View style={styles.highlightStatItem}>
                <Text style={[styles.highlightStatNumber, { color: '#059669' }]}>
                  {nationalStats.total_recovered.toLocaleString()}
                </Text>
                <Text style={styles.highlightStatLabel}>Recovered</Text>
              </View>
              <View style={styles.highlightStatItem}>
                <Text style={[styles.highlightStatNumber, { color: '#6B7280' }]}>
                  {nationalStats.total_deaths}
                </Text>
                <Text style={styles.highlightStatLabel}>Deaths</Text>
              </View>
            </View>
            
            <View style={styles.highlightFeatures}>
              <Text style={styles.featureTag}>Risk Assessment</Text>
              <Text style={styles.featureTag}>Case Statistics</Text>
              <Text style={styles.featureTag}>Affected Areas</Text>
            </View>
          </TouchableOpacity>

          {/* Safety Tips Highlight */}
          <TouchableOpacity 
            style={styles.highlightCard}
            onPress={() => router.push('/outbreak/outbreak-alert/safetytips')}
            activeOpacity={0.7}
          >
            <View style={styles.highlightHeader}>
              <View style={[styles.highlightIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="shield-checkmark" size={32} color="#059669" />
              </View>
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightTitle}>Safety Tips & Guidelines</Text>
                <Text style={styles.highlightSubtitle}>Prevention & emergency procedures</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
            
            <View style={styles.highlightPreview}>
              <View style={styles.tipPreviewItem}>
                <View style={[styles.tipPreviewIcon, { backgroundColor: '#059669' }]}>
                  <Ionicons name="shield-checkmark" size={16} color="#fff" />
                </View>
                <Text style={styles.tipPreviewText}>Dengue Prevention Guidelines</Text>
              </View>
              <View style={styles.tipPreviewItem}>
                <View style={[styles.tipPreviewIcon, { backgroundColor: '#1E40AF' }]}>
                  <Ionicons name="medical" size={16} color="#fff" />
                </View>
                <Text style={styles.tipPreviewText}>COVID-19 Symptoms Recognition</Text>
              </View>
              <View style={styles.tipPreviewItem}>
                <View style={[styles.tipPreviewIcon, { backgroundColor: '#DC2626' }]}>
                  <Ionicons name="warning" size={16} color="#fff" />
                </View>
                <Text style={styles.tipPreviewText}>Emergency Contact Procedures</Text>
              </View>
            </View>
            
            <View style={styles.highlightFeatures}>
              <Text style={styles.featureTag}>Prevention</Text>
              <Text style={styles.featureTag}>Treatment</Text>
              <Text style={styles.featureTag}>Emergency</Text>
            </View>
          </TouchableOpacity>

          {/* Recent Alerts Preview */}
          <View style={styles.alertsPreviewCard}>
            <View style={styles.alertsHeader}>
              <Text style={styles.cardTitle}>Recent Health Alerts</Text>
              {recentAlerts.length > 0 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/outbreak/outbreak-alert/outbreakdetails')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1E40AF" />
                </TouchableOpacity>
              )}
            </View>

            {recentAlerts.length > 0 ? (
              recentAlerts.slice(0, 2).map((alert) => (
                <View key={alert.id} style={styles.alertPreviewItem}>
                  <View style={styles.alertPreviewLeft}>
                    <View style={[
                      styles.alertPreviewIcon,
                      { backgroundColor: alert.alert_type === 'critical' ? '#DC2626' : '#F59E0B' }
                    ]}>
                      <Ionicons 
                        name={alert.alert_type === 'critical' ? 'warning' : 'alert-circle'} 
                        size={16} 
                        color="#fff" 
                      />
                    </View>
                    <View style={styles.alertPreviewInfo}>
                      <Text style={styles.alertPreviewTitle}>{alert.disease_name}</Text>
                      <Text style={styles.alertPreviewAreas}>
                        {alert.affected_areas.slice(0, 2).join(', ')}
                        {alert.affected_areas.length > 2 && ` +${alert.affected_areas.length - 2} more`}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.alertPreviewType,
                    { color: alert.alert_type === 'critical' ? '#DC2626' : '#F59E0B' }
                  ]}>
                    {alert.alert_type.toUpperCase()}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.noAlertsContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
                <Text style={styles.noAlertsText}>No active alerts</Text>
                <Text style={styles.noAlertsSubtext}>All districts are currently safe</Text>
              </View>
            )}
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIconContainer}>
                <Ionicons name="call" size={28} color="#fff" />
              </View>
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyTitle}>24/7 Emergency Support</Text>
                <Text style={styles.emergencySubtitle}>Ministry of Health & Population</Text>
              </View>
            </View>
            
            <View style={styles.emergencyActions}>
              <TouchableOpacity style={styles.emergencyButton}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.emergencyButtonText}>Call 103</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.emergencyButton, styles.secondaryEmergencyButton]}>
                <Ionicons name="chatbubble" size={18} color="#DC2626" />
                <Text style={[styles.emergencyButtonText, { color: '#DC2626' }]}>SMS 1115</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  // National Overview Card
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
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
  // Alerts Preview Card
  alertsPreviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },
  alertPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
  },
  alertPreviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  alertPreviewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertPreviewInfo: {
    flex: 1,
  },
  alertPreviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertPreviewAreas: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertPreviewType: {
    fontSize: 12,
    fontWeight: '700',
  },
  noAlertsContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  noAlertsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Emergency Card
  emergencyCard: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryEmergencyButton: {
    backgroundColor: '#fff',
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Highlight Cards
  highlightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  highlightIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightInfo: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  highlightSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  highlightStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  highlightStatItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  highlightStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 4,
  },
  highlightStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  highlightPreview: {
    marginBottom: 16,
    gap: 12,
  },
  tipPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    gap: 12,
  },
  tipPreviewIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipPreviewText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  highlightFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    fontSize: 12,
    color: '#1E40AF',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
});
