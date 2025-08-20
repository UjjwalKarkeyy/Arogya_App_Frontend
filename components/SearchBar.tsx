import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/doctorStyles';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, onSearch }) => (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search doctors by name or specialty..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      onSubmitEditing={onSearch}
    />
    <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
      <Text style={styles.searchButtonText}>Search</Text>
    </TouchableOpacity>
  </View>
);

export default SearchBar;
