import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../styles/doctorStyles';
import { Specialty } from '../types';

interface SpecialtyFilterProps {
  specialties: Specialty[];
  selectedSpecialty: number | null;
  onSpecialtySelect: (specialtyId: number | null) => void;
}

const SpecialtyFilter: React.FC<SpecialtyFilterProps> = ({ specialties, selectedSpecialty, onSpecialtySelect }) => {
  // Ensure specialties is always an array
  const safeSpecialties = Array.isArray(specialties) ? specialties : [];
  
  console.log('SpecialtyFilter props:', {
    specialties,
    safeSpecialties,
    selectedSpecialty,
    hasOnSpecialtySelect: !!onSpecialtySelect
  });
  
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter by Specialty:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterChip, selectedSpecialty === null && styles.filterChipActive]}
          onPress={() => onSpecialtySelect && onSpecialtySelect(null)}
        >
          <Text style={[styles.filterChipText, selectedSpecialty === null && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {safeSpecialties.map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            style={[styles.filterChip, selectedSpecialty === specialty.id && styles.filterChipActive]}
            onPress={() => onSpecialtySelect && onSpecialtySelect(specialty.id)}
          >
            <Text style={[styles.filterChipText, selectedSpecialty === specialty.id && styles.filterChipTextActive]}>
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SpecialtyFilter;
