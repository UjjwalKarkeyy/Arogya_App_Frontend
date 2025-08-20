import { Colors } from '@/constants/Colors';
import { mockData } from '@/constants/Data';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CityDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCity, setSelectedCity] = useState({
    id: 1,
    name: params.cityName || 'Kathmandu',
    region: params.cityRegion || 'Central'
  });

  const diseaseData = mockData.diseases['Seasonal Flu'];

  const quickActions = [
    { id: 1, title: 'Symptoms &\nTransmission', icon: 'warning', color: '#f59e0b' },
    { id: 2, title: 'Preventive\nMeasures', icon: 'checkmark-circle', color: '#10b981' },
    { id: 3, title: 'Treatment\nGuidelines', icon: 'medkit', color: '#3b82f6' },
    { id: 4, title: 'Vaccination\nInformation', icon: 'arrow-up', color: '#8b5cf6' },
  ];

  const handleActionPress = (action: { id: number; title: string; icon: string; color: string; }) => {
    const routeParams = {
      cityName: selectedCity.name,
      season: params.season || 'Monsoon'
    };

    switch (action.id) {
      case 1: // Symptoms & Transmission
        router.push({
          pathname: '/disease_dashboard/city/city-symptoms',
          params: routeParams
        });
        break;
      case 2: // Preventive Measures
        router.push({
          pathname: '/disease_dashboard/city/city-preventive',
          params: routeParams
        });
        break;
      case 3: // Treatment Guidelines
        router.push({
          pathname: '/disease_dashboard/city/city-treatment',
          params: routeParams
        });
        break;
      case 4: // Vaccination Information
        router.push({
          pathname: '/disease_dashboard/city/city-vaccination',
          params: routeParams
        });
        break;
      default:
        router.push('/disease_dashboard/disease/disease-info');
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
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{selectedCity.name}</Text>
            <TouchableOpacity style={styles.changeCityButton}>
              <Text style={styles.changeCityText}>Change City</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Disease Card */}
          <View style={styles.diseaseCard}>
            <Text style={styles.diseaseTitle}>Seasonal Flu</Text>
            <Text style={styles.diseaseCategory}>Viral Infections</Text>
            
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <Text style={styles.description}>{diseaseData.description}</Text>

            {/* Status Indicators */}
          
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleActionPress(action)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons 
                    name={action.icon as keyof typeof Ionicons.glyphMap} 
                    size={24} 
                    color={action.color} 
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      
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
  cityInfo: {
    flex: 1,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  changeCityButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 4,
  },
  changeCityText: {
    fontSize: 12,
    color: Colors.surface,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  diseaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  diseaseCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
