import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Modal, Pressable, Linking } from 'react-native';
import healthApi from '../../config/healthApi';
import CampaignCard from '../../components/CampaignCard';
import AuthModal from '../../components/AuthModal';
import { colors, spacing, radius, text, shadow } from '../../styles/theme';

interface Campaign {
  id: number;
  title: string;
  timing?: string | null;
  location?: string | null;
  helpline?: string | null;
  helpline_number?: string | null; // backend field
  maps_url?: string | null;
  vaccines?: any[];
  medicines?: any[];
}

interface PatientInfo {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export default function HealthCampaigns() {
  const [data, setData] = useState<Campaign[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      // Check if user is authenticated
      try {
        const token = await healthApi.getAuthToken();
        setIsAuthenticated(!!token);
      } catch (e) {
        console.warn('Failed to check auth status', e);
      }

      try {
        const res = await healthApi.get('/campaigns/');
        const items = Array.isArray(res.data) ? res.data : [];
        // Map backend helpline_number -> helpline for UI compatibility
        const normalized = items.map((c: any) => ({
          id: c.id,
          title: c.title,
          timing: c.date ?? c.timing ?? null,
          location: c.location ?? null,
          helpline: c.helpline ?? c.helpline_number ?? null,
          maps_url: c.maps_url ?? null,
          vaccines: Array.isArray(c.vaccines) ? c.vaccines : [],
          medicines: Array.isArray(c.medicines) ? c.medicines : [],
        }));
        setData(normalized);
      } catch (e) {
        console.warn('Failed to load campaigns', e);
      }
      
      // Only try to load patient info if authenticated
      if (isAuthenticated) {
        try {
          const me = await healthApi.get('/users/default-patient/');
          const p = me.data || {};
          setPatient({ full_name: p.full_name ?? null, email: p.email ?? null, phone: p.phone ?? null });
        } catch (e) {
          console.warn('Failed to load default patient', e);
        }
      }
    })();
  }, [isAuthenticated]);

  const onRegister = async (campaignId: number) => {
    const camp = data.find((c) => c.id === campaignId) ?? null;
    setSelected(camp);
    
    // Check if user is authenticated
    const token = await healthApi.getAuthToken();
    if (!token) {
      setAuthVisible(true);
      return;
    }
    
    setConfirmVisible(true);
  };

  const confirmRegister = async () => {
    if (!selected) return;
    
    try {
      const payload = { campaign: selected.id };
      console.log('[Registration] Sending payload:', payload);
      console.log('[Registration] Selected campaign:', selected);
      console.log('[Registration] Patient info:', patient);
      
      // Skip token check since user is already logged in - just try the registration
      const response = await healthApi.post('/registrations/', payload);
      console.log('[Registration] Success response:', response);
      console.log('[Registration] Registration created with ID:', response.data?.id);
      
      setConfirmVisible(false);
      setSelected(null); // Clear selected campaign
      Alert.alert('Registered', `Registration successful! ID: ${response.data?.id || 'N/A'}`);
    } catch (e: any) {
      console.error('Registration error:', e);
      const message = e.message || 'Registration failed';
      
      // Just show the error without triggering login modal since user is already logged in
      Alert.alert('Registration failed', `Error: ${message}`);
      setConfirmVisible(false);
    }
  };

  const handleAuthSuccess = async () => {
    // Verify token is actually stored
    const token = await healthApi.getAuthToken();
    if (!token) {
      Alert.alert('Error', 'Authentication failed - please try again');
      return;
    }
    
    setIsAuthenticated(true);
    
    // Reload patient info after successful authentication
    try {
      const me = await healthApi.get('/users/default-patient/');
      const p = me.data || {};
      setPatient({ full_name: p.full_name ?? null, email: p.email ?? null, phone: p.phone ?? null });
    } catch (e) {
      console.warn('Failed to load patient info after auth', e);
    }
    
    // Clear selected campaign and let user click Register again
    setSelected(null);
  };

  return (
    <>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CampaignCard campaign={item} onRegister={onRegister} />}
        ListEmptyComponent={<Text style={styles.empty}>No campaigns available.</Text>}
      />

      <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, shadow.card]}>
            <Text style={styles.modalTitle}>Confirm Registration</Text>
            {selected?.location ? (
              <Text style={styles.modalSubtitle}>Location: {selected.location}</Text>
            ) : null}
            {patient ? (
              <View style={{ marginTop: 8 }}>
                {patient.full_name ? <Text style={styles.modalSubtitle}>Name: {patient.full_name}</Text> : null}
                {patient.email ? <Text style={styles.modalSubtitle}>Email: {patient.email}</Text> : null}
                {patient.phone ? <Text style={styles.modalSubtitle}>Phone: {patient.phone}</Text> : null}
              </View>
            ) : null}
            {selected?.maps_url ? (
              <Pressable
                onPress={() => selected?.maps_url && Linking.openURL(selected.maps_url).catch(() => {})}
                style={({ pressed }) => [styles.btn, styles.btnSecondary, { marginTop: spacing.sm, opacity: pressed ? 0.92 : 1 }]}
              >
                <Text style={styles.btnSecondaryText}>Open Map</Text>
              </Pressable>
            ) : null}
            <Text style={styles.confirmText}>Are you sure you want to register?</Text>
            <View style={styles.modalRow}>
              <Pressable onPress={() => setConfirmVisible(false)} style={({ pressed }) => [styles.btn, styles.btnGhost, { opacity: pressed ? 0.92 : 1 }]}>
                <Text style={styles.btnGhostText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={confirmRegister} style={({ pressed }) => [styles.btn, styles.btnPrimary, { opacity: pressed ? 0.92 : 1 }] }>
                <Text style={styles.btnPrimaryText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <AuthModal 
        visible={authVisible}
        onClose={() => setAuthVisible(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSubtle,
    marginTop: spacing.xl,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { ...text.title },
  modalSubtitle: { marginTop: spacing.xs, color: colors.textMuted },
  modalLabel: { marginTop: spacing.md, color: colors.text, fontWeight: '600' },
  confirmText: { marginTop: spacing.md, color: colors.text, fontWeight: '600' },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.md },
  btn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: colors.buttonTextOnPrimary, fontWeight: '700' },
  btnGhost: { backgroundColor: colors.primarySoft },
  btnGhostText: { color: colors.text, fontWeight: '700' },
  btnSecondary: { backgroundColor: colors.subtle, borderWidth: 1, borderColor: colors.border },
  btnSecondaryText: { color: colors.text, fontWeight: '700' },
});