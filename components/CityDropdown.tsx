import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface City {
  id: number;
  name: string;
  region: string;
}

interface CityDropdownProps {
  selectedCity: City | null;
  cities: City[];
  onCitySelect: (city: City) => void;
  placeholder?: string;
}

export default function CityDropdown({ selectedCity, cities, onCitySelect, placeholder = "Select a city" }: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)}>
        <Text style={[styles.dropdownText, !selectedCity && styles.placeholder]}>
          {selectedCity ? selectedCity.name : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modal}>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityRegion}>{item.region} Region</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    margin: 20,
    maxHeight: 300,
    minWidth: 250,
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  cityRegion: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
