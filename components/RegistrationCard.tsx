import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, radius, text, shadow } from '../styles/theme';
import FrostedCard from './FrostedCard';

type Vaccine = { id: number; name: string; type?: string | null; age_group?: string | null; timing?: string | null };
type Medicine = { id: number; name: string; type?: string | null; age_group?: string | null; availability?: string | null; description?: string | null };
type CampaignDetail = {
  id: number;
  title: string;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  maps_url?: string | null;
  vaccines?: Vaccine[];
  medicines?: Medicine[];
};

type Registration = {
  id: number;
  campaign?: number;
  title?: string | null;
  timing?: string | null;
  location?: string | null;
  campaign_maps_url?: string | null;
  campaign_detail?: CampaignDetail | null;
};

type Props = { registration: Registration };

export default function RegistrationCard({ registration }: Props) {
  const cd = registration.campaign_detail || null;
  const title = cd?.title || registration.title || 'Campaign';
  const when = cd?.date ?? registration.timing;
  const where = cd?.location ?? registration.location;
  const mapsUrl = cd?.maps_url ?? registration.campaign_maps_url;

  const openMap = () => {
    if (mapsUrl) Linking.openURL(mapsUrl).catch(() => {});
  };

  return (
    <FrostedCard style={styles.cardOuter}>
      <Text style={styles.title}>{title}</Text>
      {when ? <Text style={styles.meta}>⏰ {String(when)}</Text> : null}
      {where ? <Text style={styles.meta}>📍 {where}</Text> : null}
      {cd?.description ? <Text style={styles.body}>{cd.description}</Text> : null}

      {(cd?.vaccines?.length || cd?.medicines?.length) ? (
        <View style={styles.section}>
          {cd?.vaccines && cd.vaccines.length > 0 ? (
            <View style={styles.group}>
              <Text style={styles.groupTitle}>Vaccines</Text>
              {cd.vaccines.map(v => (
                <Text key={`v-${v.id}`} style={styles.item}>• {v.name}{v.type ? ` (${v.type})` : ''}{v.age_group ? ` • ${v.age_group}` : ''}{v.timing ? ` • ${v.timing}` : ''}</Text>
              ))}
            </View>
          ) : null}
          {cd?.medicines && cd.medicines.length > 0 ? (
            <View style={styles.group}>
              <Text style={styles.groupTitle}>Medicines</Text>
              {cd.medicines.map(m => (
                <Text key={`m-${m.id}`} style={styles.item}>• {m.name}{m.type ? ` (${m.type})` : ''}{m.age_group ? ` • ${m.age_group}` : ''}{m.availability ? ` • ${m.availability}` : ''}{m.description ? ` — ${m.description}` : ''}</Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.row}>
        {(cd?.id || registration.campaign) ? (
          <Link href={{ pathname: '/healthCamp/campaign/[id]', params: { id: String(cd?.id ?? registration.campaign), mode: 'registered' } } as any} asChild>
            <Pressable style={({ pressed }) => [
              styles.btn,
              styles.btnGhost,
              { opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}>
              <Text style={styles.btnGhostText}>View Details</Text>
            </Pressable>
          </Link>
        ) : null}
        {mapsUrl ? (
          <Pressable onPress={openMap} style={({ pressed }) => [
            styles.btn,
            styles.btnSecondary,
            { opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}>
            <Text style={styles.btnSecondaryText}>Open Map</Text>
          </Pressable>
        ) : null}
      </View>
    </FrostedCard>
  );
}

const styles = StyleSheet.create({
  cardOuter: { padding: 0 },
  title: { ...text.title, marginBottom: spacing.xs },
  meta: { ...text.muted, marginTop: 2 },
  body: { ...text.body, marginTop: spacing.sm },
  section: { marginTop: spacing.md, backgroundColor: colors.subtle, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  group: { marginTop: spacing.xs },
  groupTitle: { fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  item: { color: colors.textMuted, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.md },
  btn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md },
  btnGhost: { backgroundColor: colors.primarySoft },
  btnGhostText: { ...text.button },
  btnSecondary: { backgroundColor: colors.subtle, borderWidth: 1, borderColor: colors.border },
  btnSecondaryText: { color: colors.text, fontWeight: '700' },
});