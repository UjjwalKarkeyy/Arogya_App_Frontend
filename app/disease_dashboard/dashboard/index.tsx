import CityDropdown from '@/components/CityDropdown';
import QuickActionGrid from '@/components/QuickActionGrid';
import SeasonSelector from '@/components/SeasonSelector';
import { Colors } from '@/constants/Colors';
import { mockData } from '@/constants/Data';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type City = { id: number; name: string; region: string };

export default function Dashboard() {
  const navigation = useNavigation()
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState('Monsoon');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleViewCity = () => {
    if (selectedCity) {
      router.push({
        pathname: '/disease_dashboard/city/city-details',
        params: { 
          cityName: selectedCity.name,
          cityRegion: selectedCity.region,
          season: selectedSeason
        }
      });
    }
  };

  const handleQuickAction = (action: { id: number; title: string; icon: string }) => {
    switch (action.id) {
      case 1: // Active Diseases
        router.push('/disease_dashboard/disease/active-diseases');
        break;
      case 2: // Prevention Tips
        router.push('/disease_dashboard/health/prevention-tips');
        break;
      case 3: // Treatment Guidelines
        router.push('/disease_dashboard/health/treatment-guidelines');
        break;
      default:
        router.push('/disease_dashboard/disease/disease-info');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: "#eee",
                  borderRadius: 10,
                }}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={{ marginLeft: 5, fontSize: 16 }}>Back</Text>
              </TouchableOpacity>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AROGYA DISEASE</Text>
          <Text style={styles.headerTitle}>DASHBOARD</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Season Selector */}
          <SeasonSelector
            selectedSeason={selectedSeason}
            onSeasonSelect={setSelectedSeason}
            seasons={mockData.seasons}
          />

          {/* Main Message */}
          <Text style={styles.mainMessage}>
            Select your City to View Disease State and Its Preventive Measures
          </Text>

          {/* City Dropdown */}
          <CityDropdown
            selectedCity={selectedCity}
            cities={mockData.cities}
            onCitySelect={setSelectedCity}
            placeholder="Select a city"
          />

          {/* View City Button */}
          <TouchableOpacity
            style={[styles.viewCityButton, !selectedCity && styles.disabledButton]}
            onPress={handleViewCity}
            disabled={!selectedCity}
          >
            <Text style={[styles.viewCityButtonText, !selectedCity && styles.disabledButtonText]}>
              VIEW YOUR CITY
            </Text>
          </TouchableOpacity>

          {/* Quick Actions Grid */}
          <QuickActionGrid
            actions={mockData.quickActions}
            onActionPress={handleQuickAction}
          />
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
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  mainMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  viewCityButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
  viewCityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  disabledButtonText: {
    color: Colors.textSecondary,
  },
});
