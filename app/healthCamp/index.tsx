import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow, text } from '../../styles/theme';

export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>

        <SectionCard
          title="Health Campaigns"
          subtitle="Explore ongoing and upcoming campaigns"
          icon="heart-pulse"
          href="./healthCamp/health-campaign"
          tint="#0EA5E9"
        />

        <SectionCard
          title="My Registrations"
          subtitle="View your booked items"
          icon="clipboard-list"
          href="./healthCamp/my-registrations"
          tint="#6366F1"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({ title, subtitle, icon, href, tint }: { title: string; subtitle: string; icon: any; href: Href; tint: string }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(href)} style={({ pressed }) => [styles.card, shadow.card, { opacity: pressed ? 0.96 : 1 }] }>
      <View style={[styles.iconWrap, { backgroundColor: tint + '20' }]}> 
        <MaterialCommunityIcons name={icon} size={28} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...text.title, textTransform: 'uppercase' },
  cardSubtitle: { ...text.subtitle, marginTop: 2, textTransform: 'uppercase' },
});