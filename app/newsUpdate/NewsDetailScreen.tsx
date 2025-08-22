import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { healthApi, NewsItem } from '../../config/healthApi';

const { width } = Dimensions.get('window');

export default function NewsDetailScreen() {
  const { id, url } = useLocalSearchParams<{ id?: string; url?: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadNewsDetail();
    } else if (url) {
      // Fallback for old URL-based navigation
      setLoading(false);
    }
  }, [id, url]);

  const loadNewsDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const news = await healthApi.getNewsById(id);
      setNewsItem(news);
    } catch (err) {
      console.error('Failed to load news detail:', err);
      setError('Failed to load news details.');
    } finally {
      setLoading(false);
    }
  };

  const formatImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('/media/')) {
      return `http://127.0.0.1:8000${imageUrl}`;
    }
    return imageUrl;
  };

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10, color: '#666', fontSize: 16 }}>Loading news details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: '#f8f9fa'
      }}>
        <Ionicons name="alert-circle-outline" size={64} color="#c62828" />
        <Text style={{ 
          color: '#c62828', 
          fontSize: 16, 
          textAlign: 'center',
          marginTop: 16,
          fontWeight: '500'
        }}>
          {error}
        </Text>
        <TouchableOpacity 
          onPress={loadNewsDetail}
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: '#0066cc',
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If we have a URL but no ID (old navigation), use WebView
  if (url && !newsItem) {
    return (
      <View style={{ flex: 1 }}>
        <WebView 
          source={{ uri: url }} 
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" style={{ flex: 1 }} />}
        />
      </View>
    );
  }

  // Display news item from API
  if (newsItem) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Hero Image */}
          {newsItem.image && (
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: formatImageUrl(newsItem.image) || undefined }}
                style={{ 
                  width: width, 
                  height: 280, 
                  resizeMode: 'cover',
                  backgroundColor: '#f0f0f0'
                }}
              />
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                backgroundColor: 'rgba(0,0,0,0.3)'
              }} />
            </View>
          )}

          {/* Article Content */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            {/* Title */}
            <Text style={{ 
              fontSize: 28, 
              fontWeight: '700', 
              marginBottom: 12,
              color: '#1a1a1a',
              lineHeight: 36,
              letterSpacing: -0.5
            }}>
              {newsItem.title}
            </Text>

            {/* Categories */}
            {newsItem.category && newsItem.category.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                {newsItem.category.map((cat) => (
                  <View 
                    key={cat.id} 
                    style={{ 
                      backgroundColor: '#f8f9fa', 
                      paddingHorizontal: 12, 
                      paddingVertical: 6, 
                      borderRadius: 16, 
                      marginRight: 8, 
                      marginBottom: 6,
                      borderWidth: 1,
                      borderColor: '#e9ecef'
                    }}
                  >
                    <Text style={{ 
                      color: '#6c757d', 
                      fontSize: 12, 
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: 0.3
                    }}>
                      {cat.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Meta Information */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 28,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#1976d2',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Ionicons name="newspaper-outline" size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  color: '#1976d2', 
                  fontSize: 14, 
                  fontWeight: '600',
                  marginBottom: 2
                }}>
                  Health News
                </Text>
                <Text style={{ 
                  color: '#666', 
                  fontSize: 13,
                  fontWeight: '400'
                }}>
                  {new Date(newsItem.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • {new Date(newsItem.published_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <TouchableOpacity style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#f8f9fa'
              }}>
                <Ionicons name="share-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Article Body */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ 
                fontSize: 18, 
                lineHeight: 30, 
                color: '#2c2c2c',
                fontWeight: '400',
                textAlign: 'left',
                letterSpacing: 0.2
              }}>
                {newsItem.content || 'No content available for this news item.'}
              </Text>
            </View>

            {/* Tags Section */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <View style={{ 
                marginBottom: 24,
                paddingTop: 24,
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0'
              }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  marginBottom: 16,
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Related Topics
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {newsItem.tags.map((tag) => (
                    <TouchableOpacity
                      key={tag.id} 
                      style={{ 
                        backgroundColor: '#f8f9fa', 
                        paddingHorizontal: 16, 
                        paddingVertical: 10, 
                        borderRadius: 25, 
                        marginRight: 10, 
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: '#e9ecef'
                      }}
                    >
                      <Text style={{ 
                        color: '#495057', 
                        fontSize: 14, 
                        fontWeight: '500' 
                      }}>
                        #{tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0'
            }}>
              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 25,
                flex: 0.48
              }}>
                <Ionicons name="heart-outline" size={18} color="#666" style={{ marginRight: 8 }} />
                <Text style={{ color: '#666', fontWeight: '500' }}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1976d2',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 25,
                flex: 0.48
              }}>
                <Ionicons name="share-social-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#666', fontSize: 16 }}>No news details available.</Text>
    </View>
  );
}
