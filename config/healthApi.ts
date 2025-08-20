import { Platform } from 'react-native';

// API Configuration
const getApiUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:8000';
  }
  
  // For Android simulator/emulator, use 10.0.2.2 (Android emulator's host loopback)
  // For physical devices, use your computer's IP address (192.168.1.73)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  
  // For iOS simulator, use localhost
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = `${getApiUrl()}/api`;

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${getApiUrl()}/api/login/`,
  SIGNUP: `${getApiUrl()}/api/signup/`,
  COMPLAINS: `${getApiUrl()}/api/complains/`,
  HEALTH: `${getApiUrl()}/api/health/`,
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

export const healthApi = {
  // Get all health categories
  getCategories: async (): Promise<Category[]> => {
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
  },
  
  // Get content for a specific category by slug
  getCategoryContent: async (slug: string): Promise<ContentItem[]> => {
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
  },
  
  // Get featured content
  getFeaturedContent: async (): Promise<ContentItem[]> => {
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
  },
  
  // Search content
  searchContent: async (query: string): Promise<ContentItem[]> => {
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
  },
  
  // Increment view count for a content item
  incrementView: async (contentId: number): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/content/${contentId}/increment_view/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  },
  
  // Helper to extract video ID from YouTube URL
  getYouTubeVideoId: (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  },
  
  // Get YouTube thumbnail URL
  getYouTubeThumbnail: (url: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string => {
    const videoId = healthApi.getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/${quality}.jpg` : '';
  }
};

export default healthApi;
