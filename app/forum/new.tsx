import { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { forumApi } from '../../config/healthApi';
import { ForumCategory } from '../../types/forum';
import { eventBus, EVENTS } from '../../services/eventBus';

export default function NewPostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await forumApi.getCategories();
        // Ensure data is an array
        const categoriesList = Array.isArray(data) ? data : data.results || [];
        if (categoriesList.length > 0) {
          setCategories(categoriesList);
          setSelectedCategoryId(categoriesList[0].id);
        } else {
          console.error('No categories found');
          setError('No categories available');
        }
      } catch (e) {
        console.error('Failed to load categories', e);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddTag = () => {
    if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
      setTags([...tags, `#${currentTag.trim()}`]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please enter both title and content.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Select category', 'Please choose a category.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const created = await forumApi.createDiscussion({
        title: title.trim(),
        content: content.trim(),
        category: selectedCategoryId,
      });
      // Reset form
      setTitle('');
      setContent('');
      setTags([]);
      setCurrentTag('');
      Alert.alert('Success', 'Post created successfully!');
      // Notify forum to refresh and navigate back to forum tab
      eventBus.emit(EVENTS.DISCUSSION_CREATED, created);
      router.back();
    } catch (e: any) {
      console.error('Failed to create discussion', e);
      setError('Failed to create post');
      Alert.alert('Error', e?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, color: '#666' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategoryId === cat.id && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategoryId === cat.id && styles.selectedCategoryText
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={content}
            onChangeText={setContent}
            placeholder="What would you like to share?"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Add a tag"
              onSubmitEditing={handleAddTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
              <Text style={styles.addTagButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Text style={styles.removeTagText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitButtonText}>{submitting ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  contentInput: {
    height: 120,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#495057',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  addTagButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  addTagButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#495057',
    marginRight: 4,
  },
  removeTagText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
