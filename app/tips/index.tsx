import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  StatusBar,
  Animated
} from "react-native";
import { tipsApi } from "../../config/healthApi";

interface Tip {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_active: boolean;
}

export default function TipSlider() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(true);

  const { width: screenWidth } = Dimensions.get("window");

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchTips();
  }, []);

  useEffect(() => {
    if (tips.length > 1) {
      startAutoSlide();
      return () => stopAutoSlide();
    }
  }, [tips]);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideTimer.current = setInterval(() => {
      currentIndex.current =
        currentIndex.current < tips.length - 1 ? currentIndex.current + 1 : 0;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true
      });
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
      autoSlideTimer.current = null;
    }
  };

  const fetchTips = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await tipsApi.getTips();
      setTips(data);
    } catch (error) {
      console.error('Error fetching tips:', error);
      Alert.alert("Error", "Failed to load tips.");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTips(true);
  };

  const renderTipCard = ({ item }: { item: Tip }) => (
    <View style={[styles.tipCard, { width: screenWidth * 0.65 }]}>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>
    </View>
  );

  if (!visible) return null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#5A8F7B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with close button */}
      <View style={styles.headerRow}>
        <Text style={styles.sliderTitle}>💡 Quick Tips</Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={tips}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderTipCard}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          currentIndex.current = Math.round(
            e.nativeEvent.contentOffset.x / (screenWidth * 0.65)
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#5A8F7B"]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: screenWidth * 0.175 // center align smaller box
        }}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {tips.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (i - 1) * (screenWidth * 0.65),
              i * (screenWidth * 0.65),
              (i + 1) * (screenWidth * 0.65)
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp"
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 6
  },
  sliderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A3F"
  },
  closeBtn: {
    fontSize: 16,
    color: "#999"
  },
  tipCard: {
    backgroundColor: "#E7F0ED",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3A5A50",
    marginBottom: 4
  },
  content: {
    fontSize: 11,
    color: "#555",
    lineHeight: 14
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#3A5A50",
    marginHorizontal: 3
  }
});