import { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import healthApi from '../../config/healthApi';
import RegistrationCard from '../../components/RegistrationCard';
import { spacing } from '../../styles/theme';

interface Registration {
  id: number;
  title?: string | null;
  timing?: string | null;
  location?: string | null;
  campaign_maps_url?: string | null;
  campaign_detail?: {
    id: number;
    title: string;
    description?: string | null;
    location?: string | null;
    date?: string | null;
    maps_url?: string | null;
    vaccines?: { id: number; name: string; type?: string | null; age_group?: string | null; timing?: string | null }[];
    medicines?: { id: number; name: string; type?: string | null; age_group?: string | null; availability?: string | null; description?: string | null }[];
  } | null;
}

export default function MyRegistrations() {
  const [data, setData] = useState<Registration[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await healthApi.get('/api/registrations/');
        const items = Array.isArray(res.data) ? res.data : [];
        setData(items);
      } catch (e) {
        console.warn('Failed to load registrations', e);
      }
    })();
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <RegistrationCard registration={item} />}
      ListEmptyComponent={<Text style={styles.empty}>No registrations yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 24 },
});