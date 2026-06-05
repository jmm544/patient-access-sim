import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import Header from '../components/Header';
import { COLORS, SHADOWS } from '../theme';
import SimBridge from '../bridge/SimBridge';

const UPCOMING = [
  {
    id: 'u1', when: 'June 15, 2026 · 2:30 PM', type: 'Cardiology Consultation',
    provider: 'Dr. Michael Chen, MD', location: 'Mayo Clinic Rochester', upcoming: true,
  },
];
const PAST = [
  {
    id: 'p1', when: 'May 2, 2026 · 10:00 AM', type: 'Annual Physical',
    provider: 'Dr. Michael Chen, MD', location: 'Mayo Clinic Rochester', upcoming: false,
  },
];

export default function AppointmentsScreen({ navigation }) {
  const [tab, setTab] = useState('upcoming');
  const [wait, setWait] = useState(SimBridge.getState('appointmentWaitDays'));

  useEffect(() => {
    const unsub = SimBridge.on('stateChange', ({ key, value }) => {
      if (key === 'appointmentWaitDays') setWait(value);
    });
    return unsub;
  }, []);

  const cancel = () =>
    Alert.alert('Cancel Appointment', 'Cancel your June 15 appointment with Dr. Chen?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel It',
        style: 'destructive',
        onPress: () => SimBridge.trigger('appointment_cancelled', { date: '2026-06-15', provider: 'Dr. Michael Chen' }),
      },
    ]);

  const data = tab === 'upcoming' ? UPCOMING : PAST;

  return (
    <View style={styles.screen}>
      <Header name="Sarah" />
      <View style={styles.tabs}>
        {['upcoming', 'past'].map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'upcoming' ? 'Upcoming' : 'Past'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: item.upcoming ? COLORS.mayoBlue : COLORS.gray }]}>
            <Text style={styles.when}>{item.when}</Text>
            <Text style={styles.meta}>{item.type}</Text>
            <Text style={styles.meta}>👤 {item.provider}</Text>
            <Text style={styles.meta}>📍 {item.location}</Text>
            {item.upcoming && wait != null && (
              <Text style={styles.waitNote}>ℹ️ Current scheduling wait: ~{wait} days</Text>
            )}
            <View style={styles.actions}>
              {item.upcoming ? (
                <>
                  <SmallBtn label="Directions" />
                  <SmallBtn label="Add to Calendar" />
                  <SmallBtn label="Cancel" danger onPress={cancel} />
                </>
              ) : (
                <SmallBtn label="View Summary" primary />
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('RequestAppointment')}>
            <Text style={styles.ctaText}>Request New Appointment</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

function SmallBtn({ label, primary, danger, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.smBtn, primary && styles.smPrimary, danger && styles.smDanger]}
    >
      <Text style={[styles.smText, primary && { color: COLORS.white }, danger && { color: COLORS.red }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mayoLight },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 11, margin: 16, marginBottom: 0, padding: 4, ...SHADOWS.card },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.mayoBlue },
  tabText: { color: COLORS.gray, fontWeight: '600' },
  tabTextActive: { color: COLORS.white },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, borderLeftWidth: 4, marginBottom: 12, ...SHADOWS.card },
  when: { fontSize: 17, fontWeight: '800', color: COLORS.mayoNavy },
  meta: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  waitNote: { fontSize: 13, color: COLORS.gray, marginTop: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  smBtn: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  smPrimary: { backgroundColor: COLORS.mayoBlue, borderColor: COLORS.mayoBlue },
  smDanger: { borderColor: '#F3C9C4' },
  smText: { fontWeight: '600', color: COLORS.mayoNavy, fontSize: 13 },
  cta: { backgroundColor: COLORS.mayoBlue, borderRadius: 9, paddingVertical: 13, alignItems: 'center', marginTop: 6 },
  ctaText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
