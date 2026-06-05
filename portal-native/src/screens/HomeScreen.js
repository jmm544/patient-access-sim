import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS, SHADOWS, SPACING } from '../theme';
import SimBridge from '../bridge/SimBridge';

function greetingPart() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

export default function HomeScreen({ navigation }) {
  const [bill, setBill] = useState(SimBridge.getState('billAmount') || 248.5);

  useEffect(() => {
    const unsub = SimBridge.on('stateChange', ({ key, value }) => {
      if (key === 'billAmount') setBill(value);
    });
    return unsub;
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const actions = [
    { icon: 'document-text-outline', title: 'View Records', sub: 'Labs, meds & more', go: () => navigation.navigate('Records') },
    { icon: 'card-outline', title: `Pay Bill ($${bill.toFixed(2)})`, sub: 'Outstanding balance', go: () => navigation.navigate('Billing') },
    { icon: 'calendar-outline', title: 'Upcoming Appt', sub: 'Jun 15, 2:30 PM', go: () => navigation.navigate('Appointments') },
    { icon: 'add-circle-outline', title: 'Request Appt', sub: 'New visit request', go: () => navigation.navigate('RequestAppointment') },
  ];

  return (
    <View style={styles.screen}>
      <Header name="Sarah" onBell={() => {}} />
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 90 }}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Good {greetingPart()}, Sarah</Text>
          <Text style={styles.heroDate}>{today}</Text>
        </View>

        <View style={styles.grid}>
          {actions.map((a) => (
            <TouchableOpacity key={a.title} style={styles.qcard} onPress={a.go}>
              <View style={styles.qicon}>
                <Ionicons name={a.icon} size={22} color={COLORS.mayoBlue} />
              </View>
              <Text style={styles.qtitle}>{a.title}</Text>
              <Text style={styles.qsub}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>Your Care Team</Text>
        <View style={styles.card}>
          <View style={styles.provider}>
            <View style={styles.photo}><Text style={styles.photoText}>MC</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pname}>Dr. Michael Chen, MD</Text>
              <Text style={styles.psub}>Cardiology · Primary Provider</Text>
            </View>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => SimBridge.trigger('provider_message_sent', { provider: 'Dr. Michael Chen' })}
            >
              <Text style={styles.smallBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.section}>Recent Activity</Text>
        <View style={styles.card}>
          <Activity icon="checkmark-done-outline" title="Lab Result: Complete Blood Count" sub="June 1, 2026 · Normal" badge="Normal" badgeColor={COLORS.green} badgeBg={COLORS.greenBg} />
          <Activity icon="document-text-outline" title="Visit Summary: Annual Physical" sub="May 2, 2026" />
          <Activity icon="card-outline" title="New Bill Issued" sub="April 28, 2026 · $248.50" badge="Due" badgeColor={COLORS.yellow} badgeBg={COLORS.yellowBg} last />
        </View>

        <Text style={styles.section}>Health Reminders</Text>
        <View style={styles.card}>
          <Activity icon="medkit-outline" title="Annual Flu Shot" sub="Recommended this fall" />
          <Activity icon="pulse-outline" title="Annual Physical" sub="Last visit May 2, 2026" last />
        </View>
      </ScrollView>
    </View>
  );
}

function Activity({ icon, title, sub, badge, badgeColor, badgeBg, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <View style={styles.rowIcon}><Ionicons name={icon} size={18} color={COLORS.mayoBlue} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mayoLight },
  hero: { backgroundColor: COLORS.mayoBlue, borderRadius: 14, padding: 18, marginBottom: 14, ...SHADOWS.lg },
  heroTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  heroDate: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  qcard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 12, ...SHADOWS.card },
  qicon: {
    width: 42, height: 42, borderRadius: 11, backgroundColor: COLORS.mayoLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  qtitle: { fontWeight: '700', color: COLORS.mayoNavy, fontSize: 14 },
  qsub: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.mayoNavy, marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, ...SHADOWS.card },
  provider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.mayoTeal, alignItems: 'center', justifyContent: 'center' },
  photoText: { color: COLORS.white, fontWeight: '700', fontSize: 17 },
  pname: { fontWeight: '700', color: COLORS.mayoNavy },
  psub: { fontSize: 13, color: COLORS.gray },
  smallBtn: { backgroundColor: COLORS.mayoBlue, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  smallBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: COLORS.mayoLight, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontWeight: '600', fontSize: 14, color: COLORS.text },
  rowSub: { fontSize: 12, color: COLORS.gray },
  badge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
