import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/doctorStyles';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.doctorCard} onPress={() => onPress(doctor)}>
    <View style={styles.doctorCardHeader}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={30} color="#3498db" />
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty_name || doctor.specialty?.name || 'General Practitioner'}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>
            {doctor.rating ? parseFloat(doctor.rating.toString()).toFixed(1) : '4.5'} ({doctor.reviews || '100+'})
          </Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Rs. {doctor.price || 500}</Text>
        <Text style={styles.perSessionText}>per session</Text>
      </View>
    </View>
    <View style={styles.doctorCardFooter}>
      <Text style={styles.opdTime}>{doctor.opd_time || 'Mon-Fri 9AM-5PM'}</Text>
    </View>
  </TouchableOpacity>
);

export default DoctorCard;
