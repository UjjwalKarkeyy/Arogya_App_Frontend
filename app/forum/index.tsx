import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { forumApi } from '../../config/healthApi';
import { ForumCategory, Discussion, User, Reply } from '../../types/forum';
import { eventBus, EVENTS } from '../../services/eventBus';

export default function ForumScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [discussionLoading, setDiscussionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Listen for newly created discussions to refresh immediately
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.DISCUSSION_CREATED, (created: any) => {
      // If payload has category id, switch to that category for user clarity
      if (created && created.category) {
        setSelectedCategory(created.category as number);
      }
      loadData();
      // Defer discussions reload slightly to allow selectedCategory state to apply
      setTimeout(() => loadDiscussions(), 0);
    });
    return unsubscribe;
  }, [selectedCategory]);

  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory]);

  // Refresh when screen gains focus (e.g., after creating a new post)
  useFocusEffect(
    useCallback(() => {
      // Reload categories (for counts) and discussions
      loadData();
      loadDiscussions();
      return () => {};
    }, [selectedCategory])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, discussionsData] = await Promise.all([
        forumApi.getCategories(),
        forumApi.getDiscussions(selectedCategory || undefined)
      ]);
      
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.results || []);
      setDiscussions(Array.isArray(discussionsData) ? discussionsData : discussionsData.results || []);

      // Load current user info
      try {
        const user = await forumApi.getCurrentUser();
        setCurrentUser(user);
      } catch (userError) {
        // User might not be authenticated, that's okay
        setCurrentUser(null);
      }
    } catch (error: any) {
      console.error('Failed to load forum data:', error);
      setError('Failed to load forum data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussions = async () => {
    try {
      setError(null);
      console.log('[Forum] Loading discussions for category:', selectedCategory);
      const discussionsData = await forumApi.getDiscussions(selectedCategory || undefined);
      // Ensure data is an array
      let discussionsList = Array.isArray(discussionsData) ? discussionsData : discussionsData.results || [];
      
      // Client-side filtering as backup if backend filtering fails
      if (selectedCategory !== null) {
        discussionsList = discussionsList.filter((discussion: Discussion) => 
          discussion.category?.id === selectedCategory
        );
        console.log('[Forum] Filtered discussions for category', selectedCategory, ':', discussionsList.length);
      }
      
      console.log('[Forum] Final discussions list:', discussionsList.length, 'items');
      setDiscussions(discussionsList);
    } catch (err) {
      setError('Failed to load discussions');
      console.error('Error loading discussions:', err);
      setDiscussions([]);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const capitalizeFirstWord = (title: string) => {
    if (!title) return title;
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const loadDiscussionDetails = async (discussionId: number) => {
    try {
      setDiscussionLoading(true);
      const [discussionData, repliesData] = await Promise.all([
        forumApi.getDiscussion(discussionId),
        forumApi.getReplies(discussionId)
      ]);
      setSelectedDiscussion(discussionData);
      const repliesList = Array.isArray(repliesData) ? repliesData : repliesData.results || [];
      setReplies(repliesList);
    } catch (err) {
      console.error('Error loading discussion details:', err);
      Alert.alert('Error', 'Failed to load discussion details');
    } finally {
      setDiscussionLoading(false);
    }
  };

  const handleDiscussionClick = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    loadDiscussionDetails(discussion.id);
  };

  const handleBackToDiscussions = () => {
    setSelectedDiscussion(null);
    setReplies([]);
    setReplyContent('');
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedDiscussion) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      setSubmitting(true);
      await forumApi.createReply(selectedDiscussion.id, replyContent.trim());
      setReplyContent('');
      Alert.alert('Success', 'Reply posted successfully!');
      // Reload discussion details
      loadDiscussionDetails(selectedDiscussion.id);
    } catch (err: any) {
      console.error('Error posting reply:', err);
      Alert.alert('Error', err?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return 'All Discussions';
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || 'All Discussions';
  };

  const handleCreatePost = () => {
    router.push('/forum/new');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading forum...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Forum</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
          <Text style={styles.createButtonText}>+ New Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.forumLayout}>
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView>
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === null && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === null && styles.selectedCategoryText
              ]}>
                All Discussions
              </Text>
              <Text style={styles.categoryCount}>{discussions.length}</Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>
                  {selectedCategory === category.id 
                    ? discussions.length 
                    : category.discussion_count || 0}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.postsContainer}>
          {selectedDiscussion ? (
            // Discussion Detail View
            <View style={styles.discussionDetailContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackToDiscussions}>
                <Text style={styles.backButtonText}>← Back to Discussions</Text>
              </TouchableOpacity>
              
              {discussionLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Loading Discussion...</Text>
                </View>
              ) : (
                <ScrollView style={styles.discussionDetailScroll}>
                  {/* Discussion Header */}
                  <View style={styles.discussionDetailHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{selectedDiscussion.category?.name}</Text>
                    </View>
                    
                    <Text style={styles.discussionDetailTitle}>{capitalizeFirstWord(selectedDiscussion.title)}</Text>
                    
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorName}>
                        by {selectedDiscussion.author?.first_name} {selectedDiscussion.author?.last_name} (@{selectedDiscussion.author?.username})
                      </Text>
                      <Text style={styles.timestamp}>
                        {formatTimeAgo(selectedDiscussion.created_at)} • {selectedDiscussion.views} views
                      </Text>
                    </View>
                  </View>

                  {/* Discussion Content */}
                  <View style={styles.discussionContent}>
                    <Text style={styles.discussionContentText}>{selectedDiscussion.content}</Text>
                  </View>

                  {/* Replies Section */}
                  <View style={styles.repliesSection}>
                    <Text style={styles.repliesTitle}>
                      Replies ({replies.length})
                    </Text>
                    
                    {replies.map((reply) => (
                      <View key={reply.id} style={styles.replyContainer}>
                        <View style={styles.replyHeader}>
                          <Text style={styles.replyAuthor}>
                            {reply.author?.first_name} {reply.author?.last_name} (@{reply.author?.username})
                          </Text>
                          <Text style={styles.replyTimestamp}>
                            {formatTimeAgo(reply.created_at)}
                          </Text>
                        </View>
                        <Text style={styles.replyContent}>{reply.content}</Text>
                      </View>
                    ))}
                    
                    {replies.length === 0 && (
                      <Text style={styles.noReplies}>No replies yet. Be the first to reply!</Text>
                    )}
                  </View>
                </ScrollView>
              )}
              
              {/* Reply Input */}
              {!discussionLoading && (
                <View style={styles.replyInputContainer}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChangeText={setReplyContent}
                    multiline
                    numberOfLines={3}
                  />
                  <TouchableOpacity
                    style={[styles.replyButton, submitting && styles.replyButtonDisabled]}
                    onPress={handleReply}
                    disabled={submitting}
                  >
                    <Text style={styles.replyButtonText}>
                      {submitting ? 'Posting...' : 'Reply'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            // Discussions List View
            <>
              <Text style={styles.sectionTitle}>{getSelectedCategoryName()}</Text>
              <ScrollView>
                {discussions.map((discussion) => (
                  <TouchableOpacity 
                    key={discussion.id} 
                    style={styles.discussionCard}
                    onPress={() => handleDiscussionClick(discussion)}
                  >
                    <View style={styles.discussionHeader}>
                      <View style={styles.discussionTitleContainer}>
                        <Text style={styles.discussionIcon}>💬</Text>
                        <Text style={styles.discussionTitle}>{capitalizeFirstWord(discussion.title)}</Text>
                      </View>
                      <Text style={styles.discussionMeta}>
                        by {discussion.author?.username} • {formatTimeAgo(discussion.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.discussionPreview} numberOfLines={2}>
                      {discussion.content || 'No preview available'}
                    </Text>
                    <View style={styles.discussionFooter}>
                      <Text style={styles.replyCount}>{discussion.reply_count || 0} replies</Text>
                      <Text style={styles.viewCount}>{discussion.views || 0} views</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  forumLayout: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
  },
  categoriesContainer: {
    width: '32%',
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
    maxHeight: '100%',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 3,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginRight: 4,
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryCount: {
    fontSize: 10,
    color: '#6c757d',
    backgroundColor: '#dee2e6',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  postsContainer: {
    flex: 1,
    padding: 10,
    maxHeight: '100%',
  },
  discussionCard: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discussionHeader: {
    marginBottom: 8,
  },
  discussionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  discussionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  discussionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  discussionMeta: {
    fontSize: 11,
    color: '#666',
  },
  discussionPreview: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 8,
  },
  discussionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyCount: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  viewCount: {
    fontSize: 11,
    color: '#999',
  },
  discussionDetailContainer: {
    flex: 1,
  },
  backButton: {
    marginBottom: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  discussionDetailScroll: {
    flex: 1,
  },
  discussionDetailHeader: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  discussionDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  discussionContent: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discussionContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  repliesSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  replyContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 15,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  replyTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  replyContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  noReplies: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  replyInputContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  replyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  replyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  replyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
