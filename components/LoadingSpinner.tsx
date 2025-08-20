import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from '../styles/doctorStyles';

const LoadingSpinner: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3498db" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

export default LoadingSpinner;
