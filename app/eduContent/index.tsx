import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const handleBackPress = () => {
    router.back();
};

interface CategoryItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
}

const categories: CategoryItem[] = [
  {
    id: '1',
    title: 'Nutrition',
    icon: 'nutrition',
    route: 'eduContent/categories/nutrition',
    color: '#4CAF50'
  },
  {
    id: '2',
    title: 'Hygiene',
    icon: 'water',
    route: 'eduContent/categories/hygiene',
    color: '#2196F3'
  },
  {
    id: '3',
    title: 'Child Health',
    icon: 'heart',
    route: 'eduContent/categories/child-health',
    color: '#FF9800'
  },
  {
    id: '4',
    title: 'Mental Health',
    icon: 'happy',
    route: 'eduContent/categories/mental-health',
    color: '#9C27B0'
  },
  {
    id: '5',
    title: 'First Aid',
    icon: 'medical',
    route: 'eduContent/categories/first-aid',
    color: '#F44336'
  },
  {
    id: '6',
    title: 'Seasonal Diseases',
    icon: 'thermometer',
    route: 'eduContent/categories/seasonal-diseases',
    color: '#607D8B'
  }
];

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  const banners = [
    {
      id: 1,
      text: 'स्वस्थ जीवनशैली\nअपनाउनुहोस् |',
      backgroundColor: '#F5E6B8',
      phoneColor: '#2C3E50',
      screenColor: '#E8F4FD',
      playButtonColor: '#FF6B6B'
    },
    {
      id: 2,
      text: 'तनाबलाई\nव्यवस्थापन गरौं |।',
      backgroundColor: '#E8F4FD',
      phoneColor: '#2C3E50',
      screenColor: '#F5E6B8',
      playButtonColor: '#4CAF50'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 10000); // Change banner every 10 seconds

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleCategoryPress = (route: string) => {
    router.push(route as any);
  };

  const handleBannerToggle = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=> router.push('./')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>Educational Contents</Text>
          <Text style={styles.subtitle}>Your Health Education Companion</Text>
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          style={[styles.banner, { backgroundColor: banners[currentBanner].backgroundColor }]} 
          onPress={handleBannerToggle}
          activeOpacity={0.9}
        >
        <View style={styles.bannerContent}>
          <View style={styles.bannerLeft}>
            <View style={[styles.phoneContainer, { backgroundColor: banners[currentBanner].phoneColor }]}>
              <View style={[styles.phoneScreen, { backgroundColor: banners[currentBanner].screenColor }]}>
                <View style={styles.screenContent}>
                  <View style={styles.videoThumbnail}>
                    <View style={[styles.playButton, { backgroundColor: banners[currentBanner].playButtonColor }]}>
                      <Ionicons name="play" size={14} color="white" />
                    </View>
                  </View>
                  <View style={styles.screenLines}>
                    <View style={styles.screenLine} />
                    <View style={styles.screenLine} />
                    <View style={styles.screenLine} />
                  </View>
                </View>
              </View>
              <View style={styles.phoneButton} />
            </View>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerText}>{banners[currentBanner].text}</Text>
          </View>
        </View>
        <View style={styles.bannerIndicators}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: currentBanner === index ? banners[currentBanner].playButtonColor : '#E0E0E0'
                }
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
      </Animated.View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { 
                borderColor: category.color,
                shadowColor: category.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 6,
                marginBottom: index < 4 ? 12 : 0,
              }]}
              onPress={() => handleCategoryPress(category.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { 
                backgroundColor: category.color,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }]}>
                <Ionicons name={category.icon} size={36} color="white" />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a252f',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c7b7f',
    textAlign: 'center',
    fontWeight: '500',
  },
  banner: {
    marginTop: 8,
    marginHorizontal: 0,
    marginBottom: 8,
    borderRadius: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    height: 140,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    flex: 1,
  },
  bannerLeft: {
    marginRight: 20,
  },
  phoneContainer: {
    width: 50,
    height: 75,
    borderRadius: 8,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneScreen: {
    width: 40,
    height: 55,
    borderRadius: 4,
    padding: 4,
  },
  screenContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoThumbnail: {
    height: 20,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenLines: {
    gap: 2,
  },
  screenLine: {
    height: 2,
    backgroundColor: '#CCC',
    borderRadius: 1,
  },
  phoneButton: {
    width: 12,
    height: 2,
    backgroundColor: '#555',
    borderRadius: 1,
  },
  bannerRight: {
    flex: 1,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a252f',
    lineHeight: 24,
    textAlign: 'center',
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 6,
    gap: 4,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoriesSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 5,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a252f',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  categoriesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'stretch',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    borderWidth: 0.3,
    elevation: 4,
    height: '26%',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a252f',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
