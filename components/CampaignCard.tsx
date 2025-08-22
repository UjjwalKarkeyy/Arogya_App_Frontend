import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius, text } from '../styles/theme';
import FrostedCard from './FrostedCard';
import { Link } from 'expo-router';

type Props = {
  campaign: {
    id: number;
    title: string;
    timing?: string | null;
    location?: string | null;
    helpline?: string | null;
    vaccines?: { id: number; name: string; type?: string | null; age_group?: string | null; timing?: string | null }[];
    medicines?: { id: number; name: string; type?: string | null; age_group?: string | null; description?: string | null; availability?: string | null }[];
  };
  onRegister?: (campaignId: number) => void;
};

export default function CampaignCard({ campaign, onRegister }: Props) {
  return (
    <FrostedCard>
      <Text style={styles.title}>{campaign.title}</Text>
      {campaign.timing ? <Text style={styles.meta}>⏰ {campaign.timing}</Text> : null}
      {campaign.location ? <Text style={styles.meta}>📍 {campaign.location}</Text> : null}
      {campaign.helpline ? <Text style={styles.meta}>☎️ {campaign.helpline}</Text> : null}

      <View style={styles.row}>
        <Link href={{ pathname: 'healthCamp/campaign/[id]', params: { id: String(campaign.id) } } as any} asChild>
          <Pressable style={({ pressed }) => [
            styles.btn,
            styles.btnGhost,
            { opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ] }>
            <Text style={styles.btnGhostText}>View Details</Text>
          </Pressable>
        </Link>
        <Pressable
          onPress={() => onRegister?.(campaign.id)}
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            { opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Text style={styles.btnPrimaryText}>Register</Text>
        </Pressable>
      </View>
    </FrostedCard>
  );
}

const styles = StyleSheet.create({
  title: { ...text.title, marginBottom: spacing.xs },
  meta: { ...text.muted, marginTop: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.md },
  btn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { ...text.buttonPrimary },
  btnGhost: { backgroundColor: colors.primarySoft },
  btnGhostText: { ...text.button },
});
