import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NearbyHospital() {
  const router = useRouter();

  const hospitals = [
    {
      id: 1,
      name: 'Tribhuvan University Teaching Hospital',
      type: 'Government Hospital',
      distance: '2.5 km',
      rating: 4.2,
      specialties: ['Emergency Care', 'General Medicine', 'Surgery'],
      phone: '+977-1-4412303',
      address: 'Maharajgunj, Kathmandu',
      availability: 'Open 24/7'
    },
    {
      id: 2,
      name: 'Norvic International Hospital',
      type: 'Private Hospital',
      distance: '3.1 km',
      rating: 4.5,
      specialties: ['Emergency Care', 'Cardiology', 'Orthopedics'],
      phone: '+977-1-4258554',
      address: 'Thapathali, Kathmandu',
      availability: 'Open 24/7'
    },
    {
      id: 3,
      name: 'Grande International Hospital',
      type: 'Private Hospital',
      distance: '4.2 km',
      rating: 4.3,
      specialties: ['Emergency Care', 'Neurology', 'Pediatrics'],
      phone: '+977-1-5159266',
      address: 'Dhapasi, Kathmandu',
      availability: 'Open 24/7'
    },
    {
      id: 4,
      name: 'Bir Hospital',
      type: 'Government Hospital',
      distance: '5.0 km',
      rating: 3.8,
      specialties: ['Emergency Care', 'General Medicine', 'Surgery'],
      phone: '+977-1-4221119',
      address: 'Mahaboudha, Kathmandu',
      availability: 'Open 24/7'
    }
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const HospitalCard = ({ hospital }: { hospital: typeof hospitals[0] }) => (
    <View style={styles.hospitalCard}>
      <View style={styles.hospitalHeader}>
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <View style={styles.hospitalMeta}>
            <View style={styles.typeDistance}>
              <Text style={styles.hospitalType}>{hospital.type}</Text>
              <Text style={styles.hospitalDistance}>• {hospital.distance}</Text>
            </View>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>{hospital.rating}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.address}>{hospital.address}</Text>
      <Text style={styles.availability}>{hospital.availability}</Text>

      <View style={styles.specialties}>
        {hospital.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.hospitalActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.callButton]}
          onPress={() => handleCall(hospital.phone)}
        >
          <Ionicons name="call" size={16} color={Colors.surface} />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => handleDirections(hospital.address)}
        >
          <Ionicons name="navigate" size={16} color={Colors.primary} />
          <Text style={styles.directionsButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nearby Hospitals</Text>
        </View>

        <View style={styles.content}>
          {/* Emergency Banner */}
          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="medical" size={24} color={Colors.error} />
            </View>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyTitle}>Emergency Services</Text>
              <Text style={styles.emergencyText}>Call 102 for ambulance services</Text>
            </View>
            <TouchableOpacity 
              style={styles.emergencyCall}
              onPress={() => handleCall('102')}
            >
              <Ionicons name="call" size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>

          {/* Location Info */}
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.locationText}>Showing hospitals near Kathmandu</Text>
          </View>

          {/* Hospital List */}
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
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
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 2,
  },
  emergencyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emergencyCall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  hospitalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hospitalHeader: {
    marginBottom: 8,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  hospitalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalType: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  hospitalDistance: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  availability: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
    marginBottom: 12,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
  },
  hospitalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButton: {
    backgroundColor: Colors.accent,
  },
  directionsButton: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.surface,
    marginLeft: 6,
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 6,
  },
});
