import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/doctorStyles';

interface NoResultsProps {
  message: string;
}

const NoResults: React.FC<NoResultsProps> = ({ message }) => (
  <View style={styles.noResultsContainer}>
    <Text style={styles.noResultsText}>No Results Found</Text>
    <Text style={styles.noResultsSubText}>{message}</Text>
  </View>
);

export default NoResults;
