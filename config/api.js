import { Platform } from 'react-native';

// API Configuration
const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'https://arogya.baryonstech.com';
  }
  
  // For Android simulator/emulator, use 10.0.2.2 (Android emulator's host loopback)
  // For physical devices, use your computer's IP address (192.168.1.73)
  if (Platform.OS === 'android') {
    return 'https://arogya.baryonstech.com';
  }
  
  // For iOS simulator, use localhost
  return 'https://arogya.baryonstech.com';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login/`,
  SIGNUP: `${API_BASE_URL}/api/signup/`,
  COMPLAINS: `${API_BASE_URL}/api/complains/`,
  HEALTH: `${API_BASE_URL}/api/health/`,
};

export default API_BASE_URL;
