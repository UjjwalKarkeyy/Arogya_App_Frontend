import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { notificationService, AppNotification } from '../../services/notificationService';
import { Link, useRouter } from 'expo-router';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get current notifications without reinitializing
    setNotifications(notificationService.getNotifications());
    setLoading(false);

    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const getIconName = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'success': return 'checkmark-circle';
      case 'news': return 'newspaper';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return '#ff9800';
      case 'success': return '#4caf50';
      case 'news': return '#0066cc';
      default: return '#2196f3';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Loading notifications...</Text>
      </View>
    );
  }
``
  if (notifications.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20
        }}>
          <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: '#666',
            marginTop: 16,
            textAlign: 'center'
          }}>
            No New Notifications
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#999',
            marginTop: 8,
            textAlign: 'center'
          }}>
            We'll notify you when there are health updates
          </Text>
        </View>
        
        {/* Bottom Navigation */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: '#e9ecef'
        }}>
          <Link href="/newsUpdate" asChild>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              marginRight: 8
            }}>
              <Ionicons name="home-outline" size={24} color="#666" />
              <Text style={{ color: '#666', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Home</Text>
            </TouchableOpacity>
          </Link>
          
          <TouchableOpacity style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
            backgroundColor: '#1976d2',
            borderRadius: 8,
            marginLeft: 8
          }}>
            <Ionicons name="notifications" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ 
        backgroundColor: '#fff', 
        paddingHorizontal: 20, 
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
      }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#333' }}>
          Notifications
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
          Stay updated with health news
        </Text>
      </View>
      
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16, paddingBottom: 100 }}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => {
              markAsRead(notification.id);
              // Navigate to news detail if it's a news notification
              if (notification.type === 'news' && notification.newsId) {
                router.push(`/news/${notification.newsId}`);
              }
            }}
            style={{
              backgroundColor: notification.read ? '#fff' : '#f0f8ff',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: getIconColor(notification.type),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons 
                name={getIconName(notification.type)} 
                size={24} 
                color={getIconColor(notification.type)}
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: notification.read ? '500' : '600',
                  color: '#333',
                  marginBottom: 4
                }}>
                  {notification.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  lineHeight: 20,
                  marginBottom: 8
                }}>
                  {notification.message}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#999',
                  fontWeight: '500'
                }}>
                  {new Date(notification.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              {!notification.read && (
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#2196f3',
                  marginTop: 8
                }} />
              )}
            </View>
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef'
      }}>
        <Link href="/newsUpdate" asChild>
          <TouchableOpacity style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            marginRight: 8
          }}>
            <Ionicons name="home-outline" size={24} color="#666" />
            <Text style={{ color: '#666', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Home</Text>
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
          backgroundColor: '#1976d2',
          borderRadius: 8,
          marginLeft: 8
        }}>
          <Ionicons name="notifications" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Notifications</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
