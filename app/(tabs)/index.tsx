import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../../components/CategoryCard';

// SVG Icon imports
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChildHealthIcon from '../../assets/icons/child_health.svg';
import FirstAidIcon from '../../assets/icons/first_aid.svg';
import HygieneIcon from '../../assets/icons/hygiene.svg';
import MentalHealthIcon from '../../assets/icons/mental_health.svg';
import OutbreakIcon from '../../assets/icons/outbreak.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import SearchIcon from '../../assets/icons/search.svg';
import SeasonalDiseasesIcon from '../../assets/icons/seasonal_diseases.svg';
import SignoutIcon from '../../assets/icons/signout.svg';
import VaccineIcon from '../../assets/icons/vaccine.svg';

import MedicineReminderIcon from '../../assets/icons/medicine_reminder.svg';

const categories = [
  { name: 'Outbreak Alert', icon: <OutbreakIcon width={40} height={40} stroke="#4CAF50" strokeWidth="2" fill="none" /> },
  { name: 'Vaccine', icon: <VaccineIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Complain/Feedback', icon: <HygieneIcon width={40} height={40} stroke="#2196F3" strokeWidth="2" fill="none" /> },
  { name: 'Disease Dashboard', icon: <ChildHealthIcon width={40} height={40} stroke="#FF9800" strokeWidth="2" fill="none" /> },
  { name: 'Doctors', icon: <MentalHealthIcon width={40} height={40} stroke="#9C27B0" strokeWidth="2" fill="none" /> },
  { name: 'Survey', icon: <FirstAidIcon width={40} height={40} stroke="#F44336" strokeWidth="2" fill="none" /> },
  { name: 'Lab Result', icon: <SeasonalDiseasesIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'News Update', icon: <SeasonalDiseasesIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Helpline', icon: <SeasonalDiseasesIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Health Camp', icon: <SeasonalDiseasesIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Medicine Reminder', icon: <MedicineReminderIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Free Medicine', icon: <SeasonalDiseasesIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
];

interface Tip {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const BASE_URL = Platform.OS === "android"
  ? "http://10.0.2.2:8000/api"
  : "http://localhost:8000/api";

export default function HomeScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryName: string) => {
    if (categoryName === 'Complain/Feedback') {
      router.push('../complain/complainAndFeedback');
    } else if (categoryName === "Outbreak Alert") {
      router.push("../outbreak/");
    } else if (categoryName === "Disease Dashboard") {
      router.push("../disease_dashboard/dashboard");
    } else if (categoryName === "Doctors") {
      router.push("../doctors/");
    } else if(categoryName === "Survey"){
      router.push("../surveyForm/")
    } else if(categoryName === "Lab Result"){
      router.push('../labResult')
    }else if (categoryName === "Vaccine") {
      router.push("./vaccine/");
    } else if (categoryName === "Survey") {
      router.push("../surveyForm/");
    } else if (categoryName === "Lab Result") {
      router.push('../labResult');
    } else if (categoryName === "News Update") {
      router.push('../newsUpdate');
    } else if (categoryName === "Helpline") {
      router.push('../helpLine');
    } else if(categoryName === "Health Camp"){
      router.push('../healthCamp')
    } else if(categoryName === "Medicine Reminder"){
      router.push('../medicineReminder')
    } else if(categoryName === "Free Medicine"){
      router.push('../freeMedicine')
    }
  };

  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const { width: screenWidth } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchTips();
  }, []);

  useEffect(() => {
    if (tips.length > 1) {
      startAutoSlide();
      return () => stopAutoSlide();
    }
  }, [tips]);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    autoSlideTimer.current = setInterval(() => {
      if (flatListRef.current && tips.length > 0) {
        // Calculate next index
        const nextIndex = (currentIndex.current + 1) % tips.length;

        // Scroll to next tip
        flatListRef.current.scrollToOffset({
          offset: nextIndex * (screenWidth * 0.65),
          animated: true
        });

        // Update current index
        currentIndex.current = nextIndex;
      }
    }, 7000);
  }, [tips.length, screenWidth]);

  const stopAutoSlide = () => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
      autoSlideTimer.current = null;
    }
  };

  const handleSignout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/login");
  }

  const fetchTips = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BASE_URL}/tips/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      const tips = data.results || data;
      setTips(tips);
    } catch (error) {
      console.log("API Error:", error);
      setTips([
        {
          id: 1,
          title: "Stay Hydrated",
          content: "Drink at least 8 glasses of water daily for better health and energy.",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Exercise Daily",
          content: "30 minutes of physical activity can improve your overall health significantly.",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Eat Fresh Fruits",
          content: "Include 2-3 servings of fresh fruits in your daily diet for essential vitamins.",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const animateTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderTipCard = ({ item }: { item: Tip }) => (
    <Animated.View
      style={[
        styles.tipCard,
        {
          width: screenWidth * 0.65,
          opacity: fadeAnim,
          transform: [{
            scale: fadeAnim.interpolate({
              inputRange: [0.3, 1],
              outputRange: [0.95, 1],
            }),
          }],
        }
      ]}
    >
      <Text style={styles.tipTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.tipContent} numberOfLines={2}>
        {item.content}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* Header */}
        <View style={styles.header}>
          <ProfileIcon width={40} height={40} />

          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}><SignoutIcon width={20} height={20} onPress={handleSignout} /></Text>
          </TouchableOpacity>
          {/* Right side: inline health-tips label + language button on same row */}
          <View style={styles.headerRight}>
            <Text style={styles.tipsInline} numberOfLines={1}>💡 Daily Health tips</Text>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageText}>ने/En</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips Slider (moved here, just under the header) */}
        {visible && (
          <View style={styles.tipsContainerBelowHeader}>
            <View style={styles.tipsHeader}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#5A8F7B" />
              </View>
            ) : (
              <>
                <FlatList
                  ref={flatListRef}
                  data={tips}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderTipCard}
                  keyExtractor={(item) => item.id.toString()}
                  snapToInterval={screenWidth * 0.65}
                  decelerationRate="fast"
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false, listener: () => animateTransition() }
                  )}
                  onScrollBeginDrag={stopAutoSlide}
                  onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(
                      e.nativeEvent.contentOffset.x / (screenWidth * 0.65)
                    );
                    currentIndex.current = newIndex;
                    startAutoSlide();
                  }}
                  contentContainerStyle={{
                    paddingHorizontal: screenWidth * 0.175,
                  }}
                />
                <View style={styles.pagination}>
                  {tips.map((_, i) => {
                    const opacity = scrollX.interpolate({
                      inputRange: [
                        (i - 1) * (screenWidth * 0.65),
                        i * (screenWidth * 0.65),
                        (i + 1) * (screenWidth * 0.65),
                      ],
                      outputRange: [0.3, 1, 0.3],
                      extrapolate: 'clamp',
                    });
                    return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
                  })}
                </View>
              </>
            )}
          </View>
        )}

        {/* Promotion Banner */}
        <View style={styles.promoBanner}>
          <Image
            source={require('../../assets/images/promo.png')}
            style={styles.promoImage}
            resizeMode="contain"
          />
          <Text style={styles.promoText}>स्वस्थ जीवनशैली अपनाउनुहोस्।</Text>
        </View>

        {/* Categories */}
        <Text style={styles.categoryTitle}>Health Features</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              icon={category.icon}
              name={category.name}
              onPress={() => handleCategoryPress(category.name)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',   // ensure right side hugs the edge
    padding: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsInline: {
    fontSize: 12,
    color: '#2E3A3F',
    marginRight: 10,                   // space before En
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  languageButton: {
    marginLeft: 0,                     // sits right after tipsInline
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  languageText: { fontWeight: 'bold' },
  tipsContainerBelowHeader: {
    marginTop: 2,                      // “a bit lower” than header baseline
    marginBottom: 10,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 20,
    margin: 15,
    borderRadius: 10,
  },
  promoImage: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  promoText: {
    fontSize: 22,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 15,
  },
  tipsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A3F',
  },
  closeBtn: {
    fontSize: 16,
    color: '#999',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  tipCard: {
    backgroundColor: '#E7F0ED',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A5A50',
    marginBottom: 4,
  },
  tipContent: {
    fontSize: 11,
    color: '#555',
    lineHeight: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#3A5A50',
    marginHorizontal: 3,
  },
});