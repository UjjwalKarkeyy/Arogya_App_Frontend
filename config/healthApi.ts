import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doctor, Specialty, AppointmentSlot } from '../types';

// API Configuration
const getApiUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:8000';
  }
  
  // For Android simulator/emulator, use 10.0.2.2 (Android emulator's host loopback)
  // For physical devices, use your computer's IP address
  if (Platform.OS === 'android') {
    // Check if running on emulator vs physical device
    // For now, we'll use the computer's IP address which works for both
    return 'http://192.168.1.74:8000';
  }
  
  // For iOS simulator and physical devices, use computer's IP address
  return 'http://192.168.1.74:8000';
};

export const API_CONFIG = {
  BASE_URL: `${getApiUrl()}/api`,
  ENDPOINTS: {
    // Authentication
    LOGIN: '/login/',
    SIGNUP: '/signup/',
    
    // Health content
    CATEGORIES: '/categories/',
    CONTENT: '/content/',
    
    // Vaccine endpoints
    VACCINES: '/vaccines/',
    VACCINE_RECORDS: '/vaccinations/',
    VACCINE_NOTIFICATIONS: '/vaccinations/notifications/',
    
    // Notifications
    COMPLAINTS: '/complains/',
    
    // Surveys
    SURVEYS: '/surveys/',
    
    // News
    NEWS: '/news/',
    
    // Doctors
    DOCTORS: '/doctors/',
    SPECIALTIES: '/specialties/',
    APPOINTMENTS: '/appointments/',
    
    // Notifications
    NOTIFICATIONS: '/notifications/',
    
    // Lab Results
    LAB_TESTS: '/lab-tests/',
    HOSPITALS: '/hospitals/',
    LAB_REPORTS: '/reports/',
    
    // Helpline
    HELPLINE_FAQ: '/faq/',
    HELPLINE_CATEGORIES: '/faq/categories/',
    HELPLINE_CHAT: '/chat/',
    
    // Tips
    TIPS: '/tips/',
    
    // Forum
    FORUM_CATEGORIES: '/forum/categories/',
    FORUM_DISCUSSIONS: '/forum/discussions/',
    FORUM_REPLIES: '/forum/replies/',
    FORUM_AUTH: '/forum/auth/',

  }
};

const BASE_URL = API_CONFIG.BASE_URL;

export const API_BASE_URL = `${getApiUrl()}/api`;

// API endpoints (keeping for backward compatibility)
export const API_ENDPOINTS = {
  LOGIN: `${getApiUrl()}/api/login/`,
  SIGNUP: `${getApiUrl()}/api/signup/`,
  COMPLAINS: `${getApiUrl()}/api/complains/`,
  HEALTH: `${getApiUrl()}/api/health/`,
  SURVEYS: `${getApiUrl()}/api/surveys/`,
  CHAT: `${getApiUrl()}/api/chat/`,
  DEFAULT_PATIENT: `${getApiUrl()}/api/users/default-patient/`,
  HELPLINE_FAQ: `${getApiUrl()}/api/faq/`,
  HELPLINE_CATEGORIES: `${getApiUrl()}/api/faq/categories/`,
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  console.log(`[API] ${response.status} ${response.statusText} - ${response.url}`);
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // If we can't parse the error as JSON, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }
  
  return response.json();
};

export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  published_at: string;
  image?: string;
  tags?: Array<{ id: number; name: string }>;
  category?: Array<{ id: number; name: string }>;
}

export interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

interface ContentItem {
  id: number;
  title: string;
  description: string;
  content_type: 'video' | 'article';
  url: string;
  thumbnail_url?: string;
  duration?: string;
  author: string;
  source: string;
  tags: string[];
  is_featured: boolean;
  is_verified: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  order: number;
  is_active: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  imageUrl?: string;
  publishedDate: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration: string;
  category: string;
  publishedDate: string;
}

class HealthApi {
  // Token management
  public async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.warn('[API] Failed to get auth token:', error);
      return null;
    }
  }

  public async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('[API] Failed to set auth token:', error);
    }
  }

  public async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('[API] Failed to clear auth token:', error);
    }
  }

  public async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAuthToken();
    console.log('[API] Token for headers:', token ? `${token.substring(0, 20)}...` : 'null');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    console.log('[API] Auth headers:', Object.keys(headers));
    return headers;
  }

public async post(
    endpoint: string,
    body: any = {},
    init?: RequestInit
  ): Promise<{ data: any }> {
    try {
      const authHeaders = await this.getAuthHeaders();
      console.log('[API] POST request to:', `${BASE_URL}${endpoint}`);
      console.log('[API] POST body:', body);
      console.log('[API] POST headers being sent:', { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(init?.headers || {})
      });
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
          ...(init?.headers || {}),
        },
        body: JSON.stringify(body),
        ...init,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errJson = await response.json();
          console.log('[API] POST error response:', errJson);
          errorMessage = errJson.detail || errJson.message || JSON.stringify(errJson);
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[API] POST success response:', data);
      console.log('[API] Response status:', response.status);
      console.log('[API] Response headers:', Object.fromEntries(response.headers.entries()));
      return { data }; // ✅ mimic axios response shape
    } catch (error) {
      console.error('[API] POST request failed:', error);
      throw error;
    }
  }

  public async get(endpoint: string = '/campaigns/'): Promise<{ data: any }> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errJson = await response.json();
          errorMessage = errJson.detail || errJson.message || JSON.stringify(errJson);
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { data }; // ✅ mimic axios: response.data
    } catch (error) {
      console.error('[API] GET request failed:', error);
      throw error;
    }
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // News endpoints
  async getNews(): Promise<NewsItem[]> {
    const response = await this.makeRequest<ApiResponse<NewsItem>>(API_CONFIG.ENDPOINTS.NEWS);
    return response.results || response as any; // Handle both paginated and non-paginated responses
  }

  async getNewsById(id: string): Promise<NewsItem> {
    return this.makeRequest<NewsItem>(`${API_CONFIG.ENDPOINTS.NEWS}${id}/`);
  }

  // Health content endpoints
  async getHealthCategories() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CATEGORIES);
  }

  async getMediaContent() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CONTENT);
  }

  // Complaints endpoints
  async getComplaints() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.COMPLAINTS);
  }

  async createComplaint(data: any) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.COMPLAINTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications - removed since we only use frontend-based notifications from news

  // Get all health categories (backward compatibility)
  async getCategories(): Promise<Category[]> {
    try {
      console.log(`[API] Fetching categories from ${API_BASE_URL}/categories/`);
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getCategories:', error);
      throw error; // Re-throw to allow components to handle the error
    }
  }
  
  // Get content for a specific category by slug
  async getCategoryContent(slug: string): Promise<ContentItem[]> {
    try {
      console.log(`[API] Fetching content for category: ${slug}`);
      
      // Use the new endpoint that filters by category slug
      const response = await fetch(`${API_BASE_URL}/categories/${slug}/content/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await handleResponse(response);
      return data.results || data; // Handle both list and paginated responses
    } catch (error) {
      console.error(`[API] Error in getCategoryContent for ${slug}:`, error);
      throw error; // Re-throw to allow components to handle the error
    }
  }
  
  // Get featured content
  async getFeaturedContent(): Promise<ContentItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/featured/`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured content');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured content:', error);
      return [];
    }
  }
  
  // Search content
  async searchContent(query: string): Promise<ContentItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/search/?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }
  
  // Increment view count for a content item
  async incrementView(contentId: number): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/content/${contentId}/increment_view/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }
  
  // Helper to extract video ID from YouTube URL
  getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  // Get YouTube thumbnail URL
  getYouTubeThumbnail(url: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string {
    const videoId = this.getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/${quality}.jpg` : '';
  }
}

export const healthApi = new HealthApi();

export const fetchDoctors = async (): Promise<Doctor[]> => {
  console.log('Fetching doctors from:', `${API_BASE_URL}/doctors/`);
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Doctors data received:', responseData);
    
    // Handle the success/data format
    if (responseData && responseData.success && responseData.data) {
      const data = responseData.data;
      
      // If data is an array, process it directly
      if (Array.isArray(data)) {
        return data.map((doctor: any): Doctor => ({
          id: doctor.id || doctor.pk,
          name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
          specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
          specialty: doctor.specialty,
          rating: doctor.rating || '4.5',
          reviews: doctor.reviews || '100+',
          price: doctor.price || 500,
          opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
          bio: doctor.bio || 'Experienced healthcare professional',
          experience: doctor.experience || '5+ years',
          education: doctor.education || 'MBBS',
          location: doctor.location || 'Kathmandu'
        }));
      }
      
      // If data is an object, check for common patterns
      if (typeof data === 'object') {
        // Check for nested results array
        if (data.results && Array.isArray(data.results)) {
          return data.results.map((doctor: any): Doctor => ({
            id: doctor.id || doctor.pk,
            name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
            specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
            specialty: doctor.specialty,
            rating: doctor.rating || '4.5',
            reviews: doctor.reviews || '100+',
            price: doctor.price || 500,
            opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
            bio: doctor.bio || 'Experienced healthcare professional',
            experience: doctor.experience || '5+ years',
            education: doctor.education || 'MBBS',
            location: doctor.location || 'Kathmandu'
          }));
        }
        
        // Check for any array in the data object
        const possibleArray = Object.values(data).find(Array.isArray);
        if (possibleArray) {
          return possibleArray.map((doctor: any): Doctor => ({
            id: doctor.id || doctor.pk,
            name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
            specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
            specialty: doctor.specialty,
            rating: doctor.rating || '4.5',
            reviews: doctor.reviews || '100+',
            price: doctor.price || 500,
            opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
            bio: doctor.bio || 'Experienced healthcare professional',
            experience: doctor.experience || '5+ years',
            education: doctor.education || 'MBBS',
            location: doctor.location || 'Kathmandu'
          }));
        }
      }
    }
    
    // If responseData is directly an array
    if (Array.isArray(responseData)) {
      return responseData.map((doctor: any): Doctor => ({
        id: doctor.id || doctor.pk,
        name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
        specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
        specialty: doctor.specialty,
        rating: doctor.rating || '4.5',
        reviews: doctor.reviews || '100+',
        price: doctor.price || 500,
        opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
        bio: doctor.bio || 'Experienced healthcare professional',
        experience: doctor.experience || '5+ years',
        education: doctor.education || 'MBBS',
        location: doctor.location || 'Kathmandu'
      }));
    }
    
    // If responseData is an object, check for common patterns
    if (typeof responseData === 'object') {
      // Check for nested results array
      if (responseData.results && Array.isArray(responseData.results)) {
        return responseData.results.map((doctor: any): Doctor => ({
          id: doctor.id || doctor.pk,
          name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
          specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
          specialty: doctor.specialty,
          rating: doctor.rating || '4.5',
          reviews: doctor.reviews || '100+',
          price: doctor.price || 500,
          opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
          bio: doctor.bio || 'Experienced healthcare professional',
          experience: doctor.experience || '5+ years',
          education: doctor.education || 'MBBS',
          location: doctor.location || 'Kathmandu'
        }));
      }
      
      // Check for any array in the responseData object
      const possibleArray = Object.values(responseData).find(Array.isArray);
      if (possibleArray) {
        return possibleArray.map((doctor: any): Doctor => ({
          id: doctor.id || doctor.pk,
          name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
          specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
          specialty: doctor.specialty,
          rating: doctor.rating || '4.5',
          reviews: doctor.reviews || '100+',
          price: doctor.price || 500,
          opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
          bio: doctor.bio || 'Experienced healthcare professional',
          experience: doctor.experience || '5+ years',
          education: doctor.education || 'MBBS',
          location: doctor.location || 'Kathmandu'
        }));
      }
    }
    
    console.warn('Unexpected API response format for doctors:', responseData);
    return [];
  } catch (error) {
    console.error('Error in fetchDoctors:', error);
    throw error;
  }
};

export const fetchSpecialties = async (): Promise<Specialty[]> => {
  console.log('Fetching specialties from:', `${API_BASE_URL}/specialties/`);
  try {
    const response = await fetch(`${API_BASE_URL}/specialties/`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Specialties data received:', responseData);
    
    // Handle the success/data format
    if (responseData && responseData.success && responseData.data) {
      const data = responseData.data;
      
      // If data is an array, process it directly
      if (Array.isArray(data)) {
        return data.map((item: any): Specialty => ({
          id: item.id || item.pk,
          name: item.name || item.specialty_name || 'Unnamed Specialty'
        }));
      }
      
      // If data is an object, check for common patterns
      if (typeof data === 'object') {
        // Check for nested results array
        if (data.results && Array.isArray(data.results)) {
          return data.results.map((item: any): Specialty => ({
            id: item.id || item.pk,
            name: item.name || item.specialty_name || 'Unnamed Specialty'
          }));
        }
        
        // Check for any array in the data object
        const possibleArray = Object.values(data).find(Array.isArray);
        if (possibleArray) {
          return possibleArray.map((item: any): Specialty => ({
            id: item.id || item.pk,
            name: item.name || item.specialty_name || 'Unnamed Specialty'
          }));
        }
      }
    }
    
    console.warn('Unexpected API response format for specialties:', responseData);
    return [];
  } catch (error) {
    console.error('Error in fetchSpecialties:', error);
    return [];
  }
};

export const fetchAvailableSlots = async (doctorId: number, date: string): Promise<AppointmentSlot[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/available-slots/?doctor_id=${doctorId}&date=${date}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.slots || [];
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
};

// Lab Result API functions
export const labResultApi = {
  // Get all lab tests
  getLabTests: async () => {
    try {
      console.log(`[API] Fetching lab tests from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.LAB_TESTS}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.LAB_TESTS}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getLabTests:', error);
      throw error;
    }
  },

  // Get all hospitals
  getHospitals: async () => {
    try {
      console.log(`[API] Fetching hospitals from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.HOSPITALS}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HOSPITALS}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getHospitals:', error);
      throw error;
    }
  },

  // Get lab reports with optional filtering
  getLabReports: async (hospitalId?: string, testName?: string) => {
    try {
      let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.LAB_REPORTS}`;
      const params = new URLSearchParams();
      
      if (hospitalId) params.append('hospital_id', hospitalId);
      if (testName) params.append('test_name', testName);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log(`[API] Fetching lab reports from ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getLabReports:', error);
      throw error;
    }
  },
};

// Helpline API functions
export const helplineApi = {
  // Get FAQ categories
  getCategories: async () => {
    try {
      console.log(`[API] Fetching FAQ categories from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.HELPLINE_CATEGORIES}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HELPLINE_CATEGORIES}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getCategories:', error);
      throw error;
    }
  },

  // Get FAQs by category
  getFAQs: async (category?: string) => {
    try {
      let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.HELPLINE_FAQ}`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      
      console.log(`[API] Fetching FAQs from ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getFAQs:', error);
      throw error;
    }
  },

  // Send chat message
  sendMessage: async (username: string, message: string) => {
    try {
      console.log(`[API] Sending chat message to ${API_BASE_URL}${API_CONFIG.ENDPOINTS.HELPLINE_CHAT}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HELPLINE_CHAT}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          message: message,
        }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in sendMessage:', error);
      throw error;
    }
  },
};

// Tips API functions
export const tipsApi = {
  // Get all tips
  getTips: async () => {
    try {
      console.log(`[API] Fetching tips from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.TIPS}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.TIPS}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getTips:', error);
      throw error;
    }
  },

  // Create a new tip
  createTip: async (tipData: { title: string; content: string; is_active?: boolean }) => {
    try {
      console.log(`[API] Creating tip at ${API_BASE_URL}${API_CONFIG.ENDPOINTS.TIPS}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.TIPS}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in createTip:', error);
      throw error;
    }
  },
};

// Survey API functions
export const surveyApi = {
  // Get all surveys
  getSurveys: async () => {
    try {
      console.log(`[API] Fetching surveys from ${API_ENDPOINTS.SURVEYS}`);
      const response = await fetch(API_ENDPOINTS.SURVEYS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getSurveys:', error);
      throw error;
    }
  },

  // Create a new survey
  createSurvey: async (surveyData: any) => {
    try {
      console.log(`[API] Creating survey at ${API_ENDPOINTS.SURVEYS}`);
      const response = await fetch(API_ENDPOINTS.SURVEYS, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in createSurvey:', error);
      throw error;
    }
  },
};

// Authentication API functions
export const authApi = {
  // Login user
  login: async (username: string, password: string) => {
    try {
      console.log(`[API] Logging in user: ${username}`);
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in login:', error);
      throw error;
    }
  },

  // Signup user
  signup: async (username: string, email: string, password: string) => {
    try {
      console.log(`[API] Signing up user: ${username}`);
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in signup:', error);
      throw error;
    }
  },
};

// User API functions
export const userApi = {
  // Get default patient information
  getDefaultPatient: async () => {
    try {
      console.log(`[API] Fetching default patient from ${API_ENDPOINTS.DEFAULT_PATIENT}`);
      const response = await fetch(API_ENDPOINTS.DEFAULT_PATIENT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getDefaultPatient:', error);
      throw error;
    }
  },
};

// Forum API functions
export const forumApi = {
  // Get forum categories
  getCategories: async () => {
    try {
      console.log(`[API] Fetching forum categories from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_CATEGORIES}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_CATEGORIES}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getCategories:', error);
      throw error;
    }
  },

  // Get discussions with optional category filter
  getDiscussions: async (categoryId?: number) => {
    try {
      let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_DISCUSSIONS}`;
      if (categoryId) {
        url += `?category=${categoryId}`;
      }
      
      console.log(`[API] Fetching discussions from ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getDiscussions:', error);
      throw error;
    }
  },

  // Get single discussion
  getDiscussion: async (id: number) => {
    try {
      console.log(`[API] Fetching discussion ${id}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_DISCUSSIONS}${id}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getDiscussion:', error);
      throw error;
    }
  },

  // Create new discussion
  createDiscussion: async (data: { title: string; content: string; category: number }) => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Creating discussion`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_DISCUSSIONS}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in createDiscussion:', error);
      throw error;
    }
  },

  // Get replies for a discussion
  getReplies: async (discussionId: number) => {
    try {
      console.log(`[API] Fetching replies for discussion ${discussionId}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_DISCUSSIONS}${discussionId}/replies/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getReplies:', error);
      throw error;
    }
  },

  // Create reply
  createReply: async (discussionId: number, content: string) => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Creating reply for discussion ${discussionId}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_DISCUSSIONS}${discussionId}/replies/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ content }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in createReply:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Fetching current user`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.FORUM_AUTH}user/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getCurrentUser:', error);
      throw error;
    }
  },
};

// Vaccine API functions
export const vaccineApi = {
  // Get all vaccines
  getVaccines: async () => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Fetching vaccines from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINES}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINES}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getVaccines:', error);
      throw error;
    }
  },

  // Get vaccine records with optional filters
  getVaccineRecords: async (filters?: { name?: string; date_given?: string; isVerified?: boolean }) => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_RECORDS}`;
      
      if (filters) {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.date_given) params.append('date_given', filters.date_given);
        if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString());
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      console.log(`[API] Fetching vaccine records from ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getVaccineRecords:', error);
      throw error;
    }
  },

  // Create a new vaccine record
  createVaccineRecord: async (recordData: any) => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Creating vaccine record at ${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_RECORDS}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_RECORDS}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(recordData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in createVaccineRecord:', error);
      throw error;
    }
  },

  // Update a vaccine record
  updateVaccineRecord: async (recordId: string, recordData: any) => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Updating vaccine record ${recordId}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_RECORDS}${recordId}/`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(recordData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in updateVaccineRecord:', error);
      throw error;
    }
  },

  // Delete a vaccine record
  deleteVaccineRecord: async (recordId: string) => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Deleting vaccine record ${recordId}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_RECORDS}${recordId}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      if (response.status === 204) {
        return { success: true };
      }
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in deleteVaccineRecord:', error);
      throw error;
    }
  },

  // Get vaccine notifications (upcoming doses)
  getVaccineNotifications: async () => {
    try {
      const authHeaders = await healthApi.getAuthHeaders();
      console.log(`[API] Fetching vaccine notifications from ${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_NOTIFICATIONS}`);
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.VACCINE_NOTIFICATIONS}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('[API] Error in getVaccineNotifications:', error);
      throw error;
    }
  },
};

export default healthApi;
