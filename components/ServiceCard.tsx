import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow, text } from '../styles/theme';
import FrostedCard from './FrostedCard';

type Vaccine = { id: number; name: string; type?: string | null; age_group?: string | null; timing?: string | null };
type Medicine = { id: number; name: string; description?: string | null; availability?: string | null };

export default function ServiceCard({ item, type }: { item: Vaccine | Medicine; type: 'vaccines' | 'medicines' }) {
  return (
    <FrostedCard style={styles.cardOuter}>
      <Text style={styles.title}>{item.name}</Text>
      {'type' in item && item.type ? <Text style={styles.meta}>Type: {item.type}</Text> : null}
      {'age_group' in item && item.age_group ? <Text style={styles.meta}>Age: {item.age_group}</Text> : null}
      {'timing' in item && item.timing ? <Text style={styles.meta}>Timing: {item.timing}</Text> : null}
      {'description' in item && item.description ? <Text style={styles.meta}>{item.description}</Text> : null}
      {'availability' in item && item.availability ? <Text style={styles.meta}>Availability: {item.availability}</Text> : null}
    </FrostedCard>
  );
}

const styles = StyleSheet.create({
  cardOuter: { marginBottom: spacing.md },
  title: { ...text.title },
  meta: { ...text.muted, marginTop: 2 },
});