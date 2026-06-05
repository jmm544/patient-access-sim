import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../theme';

export default function Header({ name = 'Sarah', onBell }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Ionicons name="add" size={20} color={COLORS.white} />
        </View>
        <Text style={styles.brandText}>Mayo Clinic</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.welcome}>Welcome, {name}</Text>
        <TouchableOpacity onPress={onBell}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.mayoNavy} />
          <View style={styles.dot} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SJ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.card,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: COLORS.mayoBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontSize: 16, fontWeight: '800', color: COLORS.mayoNavy },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  welcome: { fontSize: 13, color: COLORS.gray, fontWeight: '600' },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.mayoGold,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.mayoBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});
