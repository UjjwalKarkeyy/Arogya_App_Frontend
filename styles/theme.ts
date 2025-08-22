// Centralized theme for consistent UI/UX across the app
export const colors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  subtle: '#F8FAFC',
  primary: '#2563EB',
  primarySoft: '#EEF2FF',
  accent: '#0EA5E9',
  success: '#22C55E',
  text: '#0F172A',
  textMuted: '#475569',
  textSubtle: '#64748B',
  buttonTextOnPrimary: '#FFFFFF',
  buttonTextOnSurface: '#0F172A',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
};

export const gradients = {
  lightBg: ['#F8FAFF', '#FFFFFF'],
  subtleBlue: ['#EEF4FF', '#FFFFFF'],
  // App primary background: soft turquoise to purple
  appBg: ['#D7FFF1', '#E9D5FF'],
};

export const text = {
  title: { fontSize: 18, fontWeight: '800' as const, color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSubtle },
  body: { color: colors.text },
  muted: { color: colors.textMuted },
  buttonPrimary: { color: colors.buttonTextOnPrimary, fontWeight: '700' as const },
  button: { color: colors.buttonTextOnSurface, fontWeight: '700' as const },
};

// Reusable base styles (compose with shadow.card where needed)
export const cardBase = {
  backgroundColor: colors.surface,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: colors.border,
};

export const buttonBase = {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: radius.md,
};