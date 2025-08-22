import { useEffect, useState, useMemo } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking } from 'react-native';
import healthApi from '../../../config/healthApi';
import { colors, spacing, radius, text } from '../../../styles/theme';

interface Vaccine { id: number; name: string; type?: string | null; age_group?: string | null; timing?: string | null }
interface Medicine { id: number; name: string; type?: string | null; age_group?: string | null; availability?: string | null; description?: string | null }
interface Campaign {
  id: number;
  title: string;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  helpline_number?: string | null;
  maps_url?: string | null;
  type?: string | null;
  image_url?: string | null;
  vaccines?: Vaccine[];
  medicines?: Medicine[];
}

export default function CampaignDetails() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [fallbackVaccines, setFallbackVaccines] = useState<Vaccine[]>([]);
  const [fallbackMedicines, setFallbackMedicines] = useState<Medicine[]>([]);
  const campId = useMemo(() => Number(id), [id]);
  const isRegisteredView = String(mode || '').toLowerCase() === 'registered';

  useEffect(() => {
    // Set the header title dynamically based on mode
    // @ts-ignore - different versions may type options differently
    navigation.setOptions?.({
      title: isRegisteredView ? 'REGISTERED DETAILS' : 'DETAILS',
      headerTitle: isRegisteredView ? 'REGISTERED DETAILS' : 'DETAILS',
    });

    (async () => {
      try {
        const res = await healthApi.get(`/campaigns/${campId}/`);
        const data: Campaign = res.data;
        setCampaign(data);

        // Fallback: if this campaign has no linked vaccines/medicines, fetch general lists
        // This does NOT alter existing behavior when campaign provides its own relations.
        const needsVaccines = !(data?.vaccines && data.vaccines.length > 0);
        const needsMedicines = !(data?.medicines && data.medicines.length > 0);
        if (needsVaccines || needsMedicines) {
          try {
            const [vaxRes, medRes] = await Promise.all([
              needsVaccines ? healthApi.get('/api/services/vaccines/') : Promise.resolve({ data: [] }),
              needsMedicines ? healthApi.get('/api/services/medicines/') : Promise.resolve({ data: [] }),
            ]);
            if (needsVaccines) setFallbackVaccines(vaxRes.data ?? []);
            if (needsMedicines) setFallbackMedicines(medRes.data ?? []);
          } catch {
            // silent fallback failure – keep UI as-is
          }
        }
      } catch (e: any) {
        Alert.alert('Error', 'Unable to load campaign details.');
      }
    })();
  }, [campId, navigation, isRegisteredView]);

  const onRegister = async () => {
    try {
      const resp = await healthApi.post('/registrations/', { campaign: campId });
      const detail = resp?.data?.detail;
      Alert.alert('Registration', typeof detail === 'string' ? detail : 'Registration successful.');
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        Alert.alert('Login required', 'Please authenticate to register.');
      } else {
        Alert.alert('Registration failed', 'Please try again later.');
      }
    }
  };

  if (!campaign) return null;

  // Determine which lists to show: campaign-specific if present, otherwise general fallback
  const vaccinesToShow = (campaign.vaccines && campaign.vaccines.length > 0) ? campaign.vaccines : fallbackVaccines;
  const medicinesToShow = (campaign.medicines && campaign.medicines.length > 0) ? campaign.medicines : fallbackMedicines;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{campaign.title}</Text>
      {campaign.date ? <Text style={styles.meta}>Date: {campaign.date}</Text> : null}
      {campaign.location ? <Text style={styles.meta}>Location: {campaign.location}</Text> : null}
      {campaign.helpline_number ? <Text style={styles.meta}>Helpline: {campaign.helpline_number}</Text> : null}
      {campaign.type ? <Text style={styles.meta}>Type: {campaign.type}</Text> : null}
      {campaign.description ? <Text style={styles.body}>{campaign.description}</Text> : null}

      {campaign.maps_url ? (
        <View style={styles.sectionInline}>
          <Pressable onPress={() => campaign.maps_url && Linking.openURL(campaign.maps_url).catch(() => {})} style={({ pressed }) => [styles.btn, styles.btnSecondary, { opacity: pressed ? 0.95 : 1 }]}>
            <Text style={styles.btnSecondaryText}>Open Map</Text>
          </Pressable>
        </View>
      ) : null}

      {(vaccinesToShow?.length || medicinesToShow?.length) ? (
        <View style={styles.section}>
          {vaccinesToShow && vaccinesToShow.length > 0 ? (
            <View style={styles.group}>
              <Text style={styles.groupTitle}>Vaccines{(campaign.vaccines && campaign.vaccines.length > 0) ? '' : ' (general)'}</Text>
              {vaccinesToShow.map(v => (
                <Text key={`v-${v.id}`} style={styles.item}>• {v.name}{v.type ? ` (${v.type})` : ''}{v.age_group ? ` • ${v.age_group}` : ''}{v.timing ? ` • ${v.timing}` : ''}</Text>
              ))}
            </View>
          ) : null}
          {medicinesToShow && medicinesToShow.length > 0 ? (
            <View style={styles.group}>
              <Text style={styles.groupTitle}>Medicines{(campaign.medicines && campaign.medicines.length > 0) ? '' : ' (general)'}</Text>
              {medicinesToShow.map(m => (
                <Text key={`m-${m.id}`} style={styles.item}>• {m.name}{m.type ? ` (${m.type})` : ''}{m.age_group ? ` • ${m.age_group}` : ''}{m.availability ? ` • ${m.availability}` : ''}{m.description ? ` — ${m.description}` : ''}</Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.row}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.btn, styles.btnGhost, { opacity: pressed ? 0.95 : 1 }]}>
          <Text style={styles.btnGhostText}>Back</Text>
        </Pressable>
        {isRegisteredView ? (
          <View style={[styles.badge, styles.badgeRegistered]}>
            <Text style={styles.badgeText}>Registered</Text>
          </View>
        ) : (
          <Pressable onPress={onRegister} style={({ pressed }) => [styles.btn, styles.btnPrimary, { opacity: pressed ? 0.95 : 1 }]}>
            <Text style={styles.btnPrimaryText}>Register</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  title: { ...text.title },
  meta: { ...text.muted, marginTop: spacing.xs },
  body: { ...text.body, marginTop: spacing.md },
  section: { marginTop: spacing.lg, backgroundColor: colors.subtle, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  sectionInline: { marginTop: spacing.md },
  group: { marginTop: spacing.xs },
  groupTitle: { fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  item: { color: colors.textMuted, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.lg },
  btn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { ...text.buttonPrimary },
  btnGhost: { backgroundColor: colors.primarySoft },
  btnGhostText: { ...text.button },
  btnSecondary: { backgroundColor: colors.subtle, borderWidth: 1, borderColor: colors.border },
  btnSecondaryText: { color: colors.text, fontWeight: '700' },
  badge: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  badgeRegistered: { backgroundColor: colors.subtle, borderColor: colors.border },
  badgeText: { color: colors.text, fontWeight: '700' },
});