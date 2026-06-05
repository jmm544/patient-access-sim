// Mayo Clinic design tokens — mirrors the web portal (portal.html)

export const COLORS = {
  mayoBlue: '#005EB8',
  mayoNavy: '#003865',
  mayoGold: '#FFB81C',
  mayoTeal: '#007C89',
  mayoLight: '#F0F4F8',
  white: '#FFFFFF',
  green: '#1B7A3D',
  greenBg: '#E3F3E9',
  yellow: '#B7791F',
  yellowBg: '#FCF3DC',
  red: '#C0392B',
  redBg: '#FBE3E0',
  gray: '#5A6B7B',
  border: '#DCE4EC',
  text: '#1F2C3A',
};

export const TYPOGRAPHY = {
  h1: { fontSize: 24, fontWeight: '800', color: COLORS.mayoNavy },
  h2: { fontSize: 20, fontWeight: '700', color: COLORS.mayoNavy },
  h3: { fontSize: 16, fontWeight: '700', color: COLORS.mayoNavy },
  body: { fontSize: 15, color: COLORS.text },
  small: { fontSize: 13, color: COLORS.gray },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.gray, letterSpacing: 0.5 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  radius: 14,
};

export const SHADOWS = {
  card: {
    shadowColor: '#003865',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#003865',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
};

export default { COLORS, TYPOGRAPHY, SPACING, SHADOWS };
