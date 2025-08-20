import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreventionTips() {
  const router = useRouter();

  const preventionCategories = [
    {
      id: 1,
      title: 'Personal Hygiene',
      icon: 'hand-left',
      iconColor: '#10b981',
      tips: [
        'Wash hands frequently with soap and water for at least 20 seconds',
        'Use alcohol-based hand sanitizer when soap is not available',
        'Avoid touching your face, eyes, nose, and mouth',
        'Cover your mouth and nose when coughing or sneezing',
        'Dispose of tissues properly after use'
      ]
    },
    {
      id: 2,
      title: 'Food Safety',
      icon: 'restaurant',
      iconColor: '#f59e0b',
      tips: [
        'Drink only boiled or bottled water',
        'Eat freshly cooked food while it\'s still hot',
        'Avoid raw or undercooked meat, fish, and eggs',
        'Wash fruits and vegetables thoroughly',
        'Avoid street food and unhygienic eating places'
      ]
    },
    {
      id: 3,
      title: 'Environmental Safety',
      icon: 'leaf',
      iconColor: '#3b82f6',
      tips: [
        'Keep your surroundings clean and dry',
        'Eliminate stagnant water to prevent mosquito breeding',
        'Ensure proper ventilation in living spaces',
        'Use mosquito nets and repellents',
        'Maintain proper waste disposal practices'
      ]
    },
    {
      id: 4,
      title: 'Social Distancing',
      icon: 'people',
      iconColor: '#8b5cf6',
      tips: [
        'Maintain safe distance from sick individuals',
        'Avoid crowded places during disease outbreaks',
        'Stay home when feeling unwell',
        'Wear masks in public places when recommended',
        'Follow local health authority guidelines'
      ]
    }
  ];

  const TipCategory = ({ category }: { category: typeof preventionCategories[0] }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: category.iconColor + '20' }]}>
          <Ionicons name={category.icon as any} size={24} color={category.iconColor} />
        </View>
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </View>
      
      <View style={styles.tipsList}>
        {category.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={[styles.tipBullet, { backgroundColor: category.iconColor }]} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prevention Tips</Text>
        </View>

        <View style={styles.content}>
          {/* Introduction */}
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.accent} />
            </View>
            <Text style={styles.introTitle}>Stay Protected</Text>
            <Text style={styles.introText}>
              Follow these essential prevention tips to protect yourself and your community from diseases.
            </Text>
          </View>

          {/* Prevention Categories */}
          {preventionCategories.map((category) => (
            <TipCategory key={category.id} category={category} />
          ))}

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="call" size={20} color={Colors.error} />
              <Text style={styles.emergencyTitle}>Emergency Helpline</Text>
            </View>
            <Text style={styles.emergencyNumber}>103 / 1115</Text>
            <Text style={styles.emergencyText}>
              Call immediately if you experience severe symptoms
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 16,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  introIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  tipsList: {
    paddingLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 7,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: Colors.error + '10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    marginTop: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
