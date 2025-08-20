import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActiveDiseases() {
  const router = useRouter();

  const activeDiseases = [
    {
      id: 1,
      name: 'Seasonal Flu',
      severity: 'High',
      cases: 1250,
      trend: 'increasing',
      color: '#ef4444'
    },
    {
      id: 2,
      name: 'Common Cold',
      severity: 'Medium',
      cases: 890,
      trend: 'stable',
      color: '#f59e0b'
    },
    {
      id: 3,
      name: 'Dengue Fever',
      severity: 'High',
      cases: 320,
      trend: 'decreasing',
      color: '#ef4444'
    },
    {
      id: 4,
      name: 'Gastroenteritis',
      severity: 'Medium',
      cases: 560,
      trend: 'increasing',
      color: '#f59e0b'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'trending-up';
      case 'decreasing':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '#ef4444';
      case 'decreasing':
        return '#10b981';
      default:
        return '#6b7280';
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
          <Text style={styles.headerTitle}>Active Diseases</Text>
        </View>

        <View style={styles.content}>
          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3,020</Text>
              <Text style={styles.statLabel}>Total Cases</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Active Diseases</Text>
            </View>
          </View>

          {/* Disease List */}
          <Text style={styles.sectionTitle}>Current Disease Outbreaks</Text>
          {activeDiseases.map((disease) => (
            <View
              key={disease.id}
              style={styles.diseaseCard}
              // onPress={() => router.push('/disease_dashboard/disease/disease-info')}
            >
              <View style={styles.diseaseHeader}>
                <View style={styles.diseaseInfo}>
                  <Text style={styles.diseaseName}>{disease.name}</Text>
                  <View style={styles.severityBadge}>
                    <View style={[styles.severityDot, { backgroundColor: disease.color }]} />
                    <Text style={[styles.severityText, { color: disease.color }]}>
                      {disease.severity} Risk
                    </Text>
                  </View>
                </View>
                <View style={styles.trendContainer}>
                  <Ionicons 
                    name={getTrendIcon(disease.trend)} 
                    size={20} 
                    color={getTrendColor(disease.trend)} 
                  />
                </View>
              </View>
              
              <View style={styles.diseaseStats}>
                <Text style={styles.casesText}>{disease.cases} reported cases</Text>
                <Text style={[styles.trendText, { color: getTrendColor(disease.trend) }]}>
                  {disease.trend}
                </Text>
              </View>
            </View>
          ))}
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
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  diseaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  trendContainer: {
    padding: 4,
  },
  diseaseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  casesText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
