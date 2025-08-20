import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
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

interface SafetyTip {
  id: number;
  disease_name: string;
  title: string;
  content: string;
  tip_type: string;
  priority: number;
}

export default function SafetyTips() {
  const router = useRouter();
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSafetyTips();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchSafetyTips = async () => {
    try {
      setLoading(true);
      // Backend removed - using fallback data only
      throw new Error('Using fallback data');
    } catch (error) {
      console.log('Using fallback safety tips data');
      // Enhanced fallback data with modern content
      setSafetyTips([
        {
          id: 1,
          disease_name: 'Dengue',
          title: 'Dengue Prevention & Control',
          content: 'Eliminate mosquito breeding sites by removing standing water. Use repellents, wear long sleeves, and install window screens. Seek immediate medical attention for fever, headache, or joint pain.',
          tip_type: 'PREVENTION',
          priority: 1
        },
        {
          id: 2,
          disease_name: 'COVID-19',
          title: 'COVID-19 Safety Protocol',
          content: 'Maintain 6-feet distance, wear N95/KN95 masks in crowded areas, sanitize hands frequently, get vaccinated and boosted. Isolate immediately if experiencing symptoms.',
          tip_type: 'PREVENTION',
          priority: 1
        },
        {
          id: 3,
          disease_name: 'Cholera',
          title: 'Cholera Prevention Guidelines',
          content: 'Drink only boiled or bottled water, eat hot cooked food, avoid raw vegetables and fruits, practice good hand hygiene, and use proper sanitation facilities.',
          tip_type: 'PREVENTION',
          priority: 2
        },
        {
          id: 4,
          disease_name: 'General',
          title: 'Emergency Contact Protocol',
          content: 'Call 102 for ambulance services, 1115 for health helpline, or visit nearest health facility. Keep emergency contacts readily available and know your nearest hospital location.',
          tip_type: 'EMERGENCY',
          priority: 1
        },
        {
          id: 5,
          disease_name: 'Typhoid',
          title: 'Typhoid Symptoms Recognition',
          content: 'Watch for prolonged fever, headache, weakness, stomach pain, and rose-colored rash. Seek immediate medical care as early treatment prevents complications.',
          tip_type: 'SYMPTOMS',
          priority: 2
        },
        {
          id: 6,
          disease_name: 'General',
          title: 'First Aid Essentials',
          content: 'Keep a well-stocked first aid kit with bandages, antiseptic, thermometer, pain relievers, and emergency medications. Learn basic CPR and wound care techniques.',
          tip_type: 'TREATMENT',
          priority: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSafetyTips();
    setRefreshing(false);
  };

  const categories = ['ALL', 'PREVENTION', 'SYMPTOMS', 'TREATMENT', 'EMERGENCY'];

  const filteredTips = selectedCategory === 'ALL' 
    ? safetyTips 
    : safetyTips.filter(tip => tip.tip_type === selectedCategory);

  const getTipIcon = (tipType: string) => {
    switch (tipType) {
      case 'PREVENTION':
        return 'shield-checkmark';
      case 'SYMPTOMS':
        return 'medical';
      case 'TREATMENT':
        return 'bandage';
      case 'EMERGENCY':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getTipColor = (tipType: string) => {
    switch (tipType) {
      case 'PREVENTION':
        return '#059669';
      case 'SYMPTOMS':
        return '#1E40AF';
      case 'TREATMENT':
        return '#D97706';
      case 'EMERGENCY':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const getTipBgColor = (tipType: string) => {
    switch (tipType) {
      case 'PREVENTION':
        return '#D1FAE5';
      case 'SYMPTOMS':
        return '#DBEAFE';
      case 'TREATMENT':
        return '#FEF3C7';
      case 'EMERGENCY':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ALL':
        return 'grid-outline';
      case 'PREVENTION':
        return 'shield-checkmark-outline';
      case 'SYMPTOMS':
        return 'medical-outline';
      case 'TREATMENT':
        return 'bandage-outline';
      case 'EMERGENCY':
        return 'warning-outline';
      default:
        return 'information-circle-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Loading safety tips...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Safety Tips</Text>
          <Text style={styles.headerSubtitle}>Health Guidelines & Emergency Info</Text>
        </View>
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
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Enhanced Category Filter */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Filter by Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={getCategoryIcon(category)} 
                    size={16} 
                    color={selectedCategory === category ? '#fff' : '#1E40AF'} 
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Enhanced Safety Tips List */}
          {filteredTips.length > 0 ? (
            <View style={styles.tipsContainer}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'ALL' ? 'All Safety Tips' : `${selectedCategory} Tips`}
                <Text style={styles.tipCount}> ({filteredTips.length})</Text>
              </Text>
              {filteredTips.map((tip, index) => (
                <Animated.View 
                  key={tip.id} 
                  style={[
                    styles.tipCard,
                    { 
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <View style={styles.tipHeader}>
                    <View style={[styles.tipIcon, { backgroundColor: getTipBgColor(tip.tip_type) }]}>
                      <Ionicons name={getTipIcon(tip.tip_type)} size={24} color={getTipColor(tip.tip_type)} />
                    </View>
                    <View style={styles.tipInfo}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <View style={styles.tipMeta}>
                        <Text style={styles.tipDisease}>{tip.disease_name}</Text>
                        <View style={styles.priorityIndicator}>
                          {Array.from({ length: tip.priority }, (_, i) => (
                            <Ionicons key={i} name="star" size={12} color="#F59E0B" />
                          ))}
                        </View>
                      </View>
                    </View>
                    <View style={[styles.tipBadge, { backgroundColor: getTipColor(tip.tip_type) }]}>
                      <Text style={styles.tipBadgeText}>{tip.tip_type}</Text>
                    </View>
                  </View>
                  <Text style={styles.tipContent}>{tip.content}</Text>
                  <View style={styles.tipFooter}>
                    <TouchableOpacity style={styles.shareButton}>
                      <Ionicons name="share-outline" size={16} color="#6B7280" />
                      <Text style={styles.shareText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bookmarkButton}>
                      <Ionicons name="bookmark-outline" size={16} color="#6B7280" />
                      <Text style={styles.bookmarkText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="information-circle-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No tips found</Text>
              <Text style={styles.emptySubtitle}>Try selecting a different category</Text>
            </View>
          )}

          {/* Enhanced Emergency Contact Card */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIconContainer}>
                <Ionicons name="call" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
                <Text style={styles.emergencySubtitle}>24/7 Health Services</Text>
              </View>
            </View>
            <View style={styles.emergencyContacts}>
              <TouchableOpacity style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Ionicons name="medical" size={20} color="#DC2626" />
                  <View>
                    <Text style={styles.contactLabel}>Ambulance Service</Text>
                    <Text style={styles.contactNumber}>102</Text>
                  </View>
                </View>
                <Ionicons name="call-outline" size={20} color="#DC2626" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Ionicons name="headset" size={20} color="#1E40AF" />
                  <View>
                    <Text style={styles.contactLabel}>Health Helpline</Text>
                    <Text style={styles.contactNumber}>1115</Text>
                  </View>
                </View>
                <Ionicons name="call-outline" size={20} color="#1E40AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Ionicons name="shield" size={20} color="#059669" />
                  <View>
                    <Text style={styles.contactLabel}>Police Emergency</Text>
                    <Text style={styles.contactNumber}>100</Text>
                  </View>
                </View>
                <Ionicons name="call-outline" size={20} color="#059669" />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
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
  categoryContainer: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoryScroll: {
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  categoryTextActive: {
    color: '#fff',
  },
  tipsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipInfo: {
    flex: 1,
    gap: 6,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 22,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipDisease: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  priorityIndicator: {
    flexDirection: 'row',
    gap: 2,
  },
  tipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tipBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  tipContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 16,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  shareText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  bookmarkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emergencyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  emergencyContacts: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
});
