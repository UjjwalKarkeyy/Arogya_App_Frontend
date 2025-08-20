import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/doctorStyles';
import { Doctor } from '../../types';

interface DoctorDetailsModalProps {
  visible: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({ 
  visible, 
  doctor, 
  onClose, 
  onBookAppointment 
}) => {
  if (!doctor) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Doctor Details</Text>
          <View style={styles.closeButton} />
        </View>
        
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.doctorDetailHeader}>
            <View style={styles.modalAvatarContainer}>
              <Ionicons name="person" size={50} color="#3498db" />
            </View>
            <View style={styles.doctorDetailInfo}>
              <Text style={styles.doctorDetailName}>{doctor.name}</Text>
              <Text style={styles.doctorDetailSpecialty}>
                {doctor.specialty_name || doctor.specialty?.name || 'General Practitioner'}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>
                  {doctor.rating ? parseFloat(doctor.rating).toFixed(1) : '4.5'} ({doctor.reviews || '100+'})
                </Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>Rs. {doctor.price || 500}</Text>
              <Text style={styles.perSessionText}>per session</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Specialty:</Text>
              <Text style={styles.detailValue}>
                {doctor.specialty_name || doctor.specialty?.name || 'General Practitioner'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hospital:</Text>
              <Text style={styles.detailValue}>
                {doctor.hospital || 'Not specified'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>OPD Time:</Text>
              <Text style={styles.detailValue}>
                {doctor.opd_time || 'Mon-Fri 9AM-5PM'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Qualifications:</Text>
              <Text style={styles.detailValue}>
                {doctor.qualifications || 'MBBS, MD'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Languages:</Text>
              <Text style={styles.detailValue}>
                {doctor.languages || 'English, Hindi'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Experience:</Text>
              <Text style={styles.detailValue}>
                {doctor.experience_years || 0} years
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rating:</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.detailValue}>
                  {doctor.rating ? parseFloat(doctor.rating).toFixed(1) : '4.5'} out of 5
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bio:</Text>
              <Text style={styles.detailValue}>
                {doctor.bio || 'Experienced medical professional dedicated to providing quality healthcare services.'}
              </Text>
            </View>

            {doctor.phone && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{doctor.phone}</Text>
              </View>
            )}

            {doctor.email && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{doctor.email}</Text>
              </View>
            )}

            {doctor.address && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>{doctor.address}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={() => onBookAppointment(doctor)}>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
