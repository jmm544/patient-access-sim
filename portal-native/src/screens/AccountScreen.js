import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Header from '../components/Header';
import { COLORS, SHADOWS } from '../theme';

export default function AccountScreen({ navigation }) {
  const [prefs, setPrefs] = useState({ email: true, sms: true, marketing: false, twoFactor: true });
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const signOut = () =>
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
    );

  return (
    <View style={styles.screen}>
      <Header name="Sarah" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
        <Text style={styles.title}>Account</Text>

        <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
          <View style={styles.av}><Text style={styles.avText}>SJ</Text></View>
          <Text style={styles.name}>Sarah Johnson</Text>
          <Text style={styles.sub}>DOB: March 15, 1985 · MRN: MRN-2024-00847</Text>
          <Text style={styles.sub}>sarah.johnson@email.com · (507) 555-0142</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <Card title="Insurance Info">
          <Row label="BlueCross BlueShield PPO" sub="Member ID ••••7841" right={<Badge text="Active" />} last />
        </Card>

        <Card title="Communication Preferences">
          <ToggleRow label="Email notifications" value={prefs.email} onChange={() => toggle('email')} />
          <ToggleRow label="SMS reminders" value={prefs.sms} onChange={() => toggle('sms')} />
          <ToggleRow label="Marketing emails" value={prefs.marketing} onChange={() => toggle('marketing')} last />
        </Card>

        <Card title="Linked Devices">
          <Row label="iPhone 15 · Mayo App" sub="Last active today" last />
        </Card>

        <Card title="Privacy & Security">
          <ToggleRow label="Two-factor authentication" value={prefs.twoFactor} onChange={() => toggle('twoFactor')} />
          <Row label="Change password" sub="" last />
        </Card>

        <TouchableOpacity style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}
function Row({ label, sub, right, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {!!sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {right}
    </View>
  );
}
function ToggleRow({ label, value, onChange, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: COLORS.mayoBlue, false: '#C7D2DC' }}
        thumbColor={COLORS.white}
      />
    </View>
  );
}
function Badge({ text }) {
  return (
    <View style={styles.badge}><Text style={styles.badgeText}>{text}</Text></View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mayoLight },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.mayoNavy, marginBottom: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, ...SHADOWS.card },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.mayoNavy, marginBottom: 6 },
  av: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.mayoBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avText: { color: COLORS.white, fontSize: 26, fontWeight: '800' },
  name: { fontSize: 19, fontWeight: '700', color: COLORS.mayoNavy },
  sub: { color: COLORS.gray, fontSize: 13, marginTop: 2 },
  editBtn: { borderWidth: 1.5, borderColor: COLORS.mayoBlue, borderRadius: 9, paddingHorizontal: 20, paddingVertical: 9, marginTop: 14 },
  editText: { color: COLORS.mayoBlue, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { fontSize: 14, color: COLORS.text, flex: 1 },
  rowSub: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  badge: { backgroundColor: COLORS.greenBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { color: COLORS.green, fontWeight: '700', fontSize: 11 },
  signOut: { borderWidth: 1.5, borderColor: COLORS.red, borderRadius: 9, paddingVertical: 13, alignItems: 'center' },
  signOutText: { color: COLORS.red, fontWeight: '700', fontSize: 15 },
});
