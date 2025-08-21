import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { healthApi, NewsItem } from '../../config/healthApi';
import { notificationService } from '../../services/notificationService';

export default function HomeScreen() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await healthApi.getNews();
      setNewsData(news);
      
      // Check for new news and create notifications
      notificationService.checkForNewNews(news);
    } catch (err) {
      console.error('Failed to load news:', err);
      setError('Could not fetch news. Please check your connection and try again.');
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    // If it's a relative URL from Django, prepend the base URL
    if (imageUrl.startsWith('/media/')) {
      return `http://127.0.0.1:8000${imageUrl}`;
    }
    return imageUrl;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading news...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>
          Stay updated with the latest health news
        </Text>
      </View>

      {error && (
        <View style={{ 
          backgroundColor: '#ffebee', 
          padding: 16, 
          borderRadius: 12, 
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#c62828'
        }}>
          <Text style={{ color: '#c62828', fontSize: 14, marginBottom: 8 }}>{error}</Text>
          <TouchableOpacity 
            onPress={loadNews} 
            style={{ 
              backgroundColor: '#1976d2',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              alignSelf: 'flex-start'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/news/${item.id}` as any} asChild>
            <TouchableOpacity style={{ 
              flexDirection: 'row', 
              marginVertical: 8, 
              alignItems: 'flex-start',
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Image
                source={{ uri: formatImageUrl(item.image) || 'https://via.placeholder.com/100x80?text=No+Image' }}
                style={{ 
                  width: 100, 
                  height: 80, 
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0'
                }}
                defaultSource={{ uri: 'https://via.placeholder.com/100x80?text=Loading' }}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: '#333',
                  lineHeight: 22,
                  marginBottom: 4
                }}>
                  {item.title}
                </Text>
                <Text style={{ 
                  marginTop: 4, 
                  color: '#666', 
                  fontSize: 14,
                  lineHeight: 20
                }} numberOfLines={2}>
                  {item.content || 'No description available'}
                </Text>
                <Text style={{ 
                  marginTop: 8, 
                  color: '#999', 
                  fontSize: 12,
                  fontWeight: '500'
                }}>
                  {new Date(item.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        refreshing={loading}
        onRefresh={loadNews}
      />
      </View>
      
      {/* Bottom Navigation Bar */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      }}>
        <TouchableOpacity 
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
            backgroundColor: '#1976d2',
            borderRadius: 8,
            marginRight: 8
          }}
        >
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Home</Text>
        </TouchableOpacity>
        
        <Link href="/newsUpdate/NotificationScreen" asChild>
          <TouchableOpacity 
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              marginLeft: 8
            }}
          >
          <Ionicons name="notifications-outline" size={24} color="#666" />
          <Text style={{ color: '#666', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Notifications</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
