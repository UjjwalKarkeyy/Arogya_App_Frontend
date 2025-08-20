import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/doctorStyles';
import { Doctor } from '../../types';

const API_BASE_URL = 'http://localhost:8000/api';

interface AppointmentBookingModalProps {
  visible: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({ 
  visible, 
  doctor, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '17:00', label: '5:00 PM' },
  ];

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientAge: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: ''
    });
    setAvailableSlots([]);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fetchAvailableSlots = async (date: string) => {
    if (!doctor || !date) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/available-slots/${doctor.id}/?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.data.available_slots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, appointmentDate: date, appointmentTime: '' }));
    
    // Only fetch slots if date is in valid format (YYYY-MM-DD) and complete
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
      fetchAvailableSlots(date);
    } else {
      setAvailableSlots([]); // Clear slots for incomplete dates
    }
  };

  const handleSubmit = async () => {
    console.log('Form data:', formData);
    
    if (!formData.patientName || !formData.patientPhone || !formData.patientAge || 
        !formData.appointmentDate || !formData.appointmentTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting appointment:', {
        doctor: doctor!.id,
        patient_name: formData.patientName,
        patient_phone: formData.patientPhone,
        patient_email: formData.patientEmail,
        patient_age: parseInt(formData.patientAge),
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        reason: formData.reason
      });

      const response = await fetch(`${API_BASE_URL}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor: doctor!.id,
          patient_name: formData.patientName,
          patient_phone: formData.patientPhone,
          patient_email: formData.patientEmail,
          patient_age: parseInt(formData.patientAge),
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          reason: formData.reason
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && (data.success || data.id)) {
        setSuccess(true);
        Alert.alert('Success', 'Appointment booked successfully!');
      } else {
        Alert.alert('Error', data.message || data.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!doctor) return null;

  if (success) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#27ae60" />
            <Text style={styles.successTitle}>Appointment Booked!</Text>
            <Text style={styles.successMessage}>
              Your appointment with Dr. {doctor.name} has been successfully booked.
            </Text>
            <TouchableOpacity style={styles.successButton} onPress={handleClose}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Book Appointment</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.doctorSummary}>
            <View style={styles.modalAvatarContainer}>
              <Ionicons name="person" size={40} color="#3498db" />
            </View>
            <View style={styles.doctorSummaryInfo}>
              <Text style={styles.doctorSummaryName}>Dr. {doctor.name}</Text>
              <Text style={styles.doctorSummarySpecialty}>
                {doctor.specialty_name || doctor.specialty?.name}
              </Text>
              <Text style={styles.doctorSummaryPrice}>Rs. {doctor.price || 500}</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientName: text }))}
                placeholder="Enter patient name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientPhone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientPhone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientEmail}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientEmail: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientAge}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientAge: text }))}
                placeholder="Enter age"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Appointment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.appointmentDate}
                onChangeText={handleDateChange}
                placeholder={`YYYY-MM-DD (min: ${getTomorrowDate()})`}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time Slot *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsContainer}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.value}
                    style={[
                      styles.timeSlot,
                      formData.appointmentTime === slot.value && styles.timeSlotSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, appointmentTime: slot.value }))}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      formData.appointmentTime === slot.value && styles.timeSlotTextSelected
                    ]}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason for Visit</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.reason}
                onChangeText={(text) => setFormData(prev => ({ ...prev, reason: text }))}
                placeholder="Describe your symptoms or reason for visit"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.bookButton, loading && styles.bookButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
