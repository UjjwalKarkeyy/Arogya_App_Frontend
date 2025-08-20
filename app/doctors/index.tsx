import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { fetchDoctors, fetchSpecialties } from '../../config/healthApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import SpecialtyFilter from '../../components/SpecialtyFilter';
import DoctorCard from '../../components/DoctorCard';
import NoResults from '../../components/NoResults';
import { DoctorDetailsModal } from './doctorDetails';
import { AppointmentBookingModal } from './appointmentBooking';
import { styles } from '../../styles/doctorStyles';
import { Doctor, Specialty } from '../../types';

export default function DoctorsHome() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bookingModalVisible, setBookingModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Starting to load data...');

      // Fetch both doctors and specialties in parallel
      const [doctorsResponse, specialtiesResponse] = await Promise.all([
        fetchDoctors(),
        fetchSpecialties()
      ]);

      // Process doctors data
      setDoctors(doctorsResponse);
      setFilteredDoctors(doctorsResponse);

      // Process specialties data
      setSpecialties(specialtiesResponse);

      console.log('Data loading completed');
      console.log('Doctors count:', doctorsResponse.length);
      console.log('Specialties count:', specialtiesResponse.length);

    } catch (error) {
      console.error('Unexpected error in loadData:', error);
      Alert.alert('Error', 'An unexpected error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    if (!Array.isArray(doctors)) {
      setFilteredDoctors([]);
      return;
    }

    let filtered = [...doctors];

    // Filter by specialty if selected
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => {
        // doctor.specialty can be either an ID (number) or an object
        const resolvedSpecialty =
          (typeof doctor.specialty === 'object' ? doctor.specialty?.id : doctor.specialty);
        const specialtyId = resolvedSpecialty != null ? String(resolvedSpecialty) : '';
        return specialtyId === String(selectedSpecialty);
      });
      console.log('Filtered by specialty:', filtered);
    }

    // Filter by search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(doctor => {
        const name = doctor.name || '';
        const specialtyName = doctor.specialty_name || doctor.specialty?.name || '';

        return (
          name.toLowerCase().includes(query) ||
          specialtyName.toLowerCase().includes(query)
        );
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleSearch = () => {
    filterDoctors();
  };

  const handleSpecialtySelect = (specialtyId: number | null) => {
    console.log('Selected specialty ID:', specialtyId);
    console.log('Current selected specialty:', selectedSpecialty);
    setSelectedSpecialty(specialtyId);
  };

  const handleDoctorPress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(false);
    setBookingModalVisible(true);
  };

  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
    setSelectedDoctor(null);
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => <DoctorCard doctor={item} onPress={handleDoctorPress} />;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styless.backButton} onPress={() => router.push('./')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Arogya Doctors</Text>
          <Text style={styles.headerSubtitle}>Find the best doctors near you</Text>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styless.backButton} onPress={() => router.push('./')}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arogya Doctors</Text>
        <Text style={styles.headerSubtitle}>Find the best doctors near you</Text>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <SpecialtyFilter
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSpecialtySelect={handleSpecialtySelect}
      />

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {filteredDoctors.length === 0 ? (
        <NoResults message="Try adjusting your search criteria or filters" />
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <DoctorDetailsModal
        visible={modalVisible}
        doctor={selectedDoctor}
        onClose={handleCloseModal}
        onBookAppointment={handleBookAppointment}
      />

      <AppointmentBookingModal
        visible={bookingModalVisible}
        doctor={selectedDoctor}
        onClose={handleCloseBookingModal}
      />
    </SafeAreaView>
  );
}

const styless = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
})