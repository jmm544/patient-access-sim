import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS, SHADOWS } from '../theme';
import SimBridge from '../bridge/SimBridge';

const LABS = [
  { test: 'Complete Blood Count', date: 'Jun 1, 2026', result: 'Within range', status: 'Normal' },
  { test: 'Lipid Panel', date: 'May 2, 2026', result: 'LDL elevated', status: 'Review' },
];
const MEDS = [
  { name: 'Lisinopril 10mg', meta: 'Once daily · Dr. Michael Chen' },
  { name: 'Metformin 500mg', meta: 'Twice daily · Dr. Michael Chen' },
  { name: 'Aspirin 81mg', meta: 'Once daily · Dr. Michael Chen' },
];
const ALLERGIES = [
  { name: 'Penicillin', sub: 'Reaction: hives', sev: 'Moderate' },
  { name: 'Sulfa drugs', sub: 'Reaction: rash', sev: 'Mild' },
];
const IMMUN = [
  { name: 'Influenza Vaccine', date: 'October 2025' },
  { name: 'COVID-19 Booster', date: 'August 2025' },
];

function Section({ title, defaultOpen, onOpen, children }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && onOpen) onOpen();
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.secHead} onPress={toggle}>
        <Text style={styles.secTitle}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.gray} />
      </TouchableOpacity>
      {open && <View style={{ marginTop: 10 }}>{children}</View>}
    </View>
  );
}

function StatusBadge({ status }) {
  const map = {
    Normal: [COLORS.green, COLORS.greenBg],
    Review: [COLORS.yellow, COLORS.yellowBg],
    Moderate: [COLORS.yellow, COLORS.yellowBg],
    Mild: [COLORS.gray, '#EAF0F5'],
    Complete: [COLORS.green, COLORS.greenBg],
  };
  const [c, bg] = map[status] || [COLORS.gray, '#EAF0F5'];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: c }]}>{status}</Text>
    </View>
  );
}

export default function MedicalRecordsScreen() {
  useEffect(() => {
    SimBridge.trigger('records_accessed', { section: 'records' });
  }, []);

  const refill = (med) =>
    SimBridge.trigger('refill_requested', { medication: med }) ||
    Alert.alert('Refill requested', `Refill requested for ${med}.`);

  return (
    <View style={styles.screen}>
      <Header name="Sarah" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Medical Records</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.hdrBtn}><Text style={styles.hdrBtnText}>Download</Text></TouchableOpacity>
            <TouchableOpacity style={styles.hdrBtn}><Text style={styles.hdrBtnText}>Share</Text></TouchableOpacity>
          </View>
        </View>

        <Section title="Labs" defaultOpen onOpen={() => SimBridge.trigger('records_accessed', { section: 'labs' })}>
          {LABS.map((l) => (
            <View key={l.test} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{l.test}</Text>
                <Text style={styles.rowSub}>{l.date} · {l.result}</Text>
              </View>
              <StatusBadge status={l.status} />
            </View>
          ))}
        </Section>

        <Section title="Medications" onOpen={() => SimBridge.trigger('records_accessed', { section: 'meds' })}>
          {MEDS.map((m) => (
            <View key={m.name} style={styles.med}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{m.name}</Text>
                <Text style={styles.rowSub}>{m.meta}</Text>
              </View>
              <TouchableOpacity style={styles.refill} onPress={() => refill(m.name)}>
                <Text style={styles.refillText}>Refill</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Section>

        <Section title="Allergies" onOpen={() => SimBridge.trigger('records_accessed', { section: 'allergies' })}>
          {ALLERGIES.map((a) => (
            <View key={a.name} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{a.name}</Text>
                <Text style={styles.rowSub}>{a.sub}</Text>
              </View>
              <StatusBadge status={a.sev} />
            </View>
          ))}
        </Section>

        <Section title="Immunizations" onOpen={() => SimBridge.trigger('records_accessed', { section: 'immun' })}>
          {IMMUN.map((i) => (
            <View key={i.name} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{i.name}</Text>
                <Text style={styles.rowSub}>{i.date}</Text>
              </View>
              <StatusBadge status="Complete" />
            </View>
          ))}
        </Section>

        <Section title="Imaging">
          <Text style={styles.empty}>No records available · coming soon</Text>
        </Section>
        <Section title="Visit Notes">
          <Text style={styles.empty}>No records available · coming soon</Text>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mayoLight },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.mayoNavy },
  hdrBtn: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  hdrBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.mayoNavy },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, ...SHADOWS.card },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secTitle: { fontSize: 16, fontWeight: '700', color: COLORS.mayoNavy },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowTitle: { fontWeight: '700', color: COLORS.mayoNavy, fontSize: 14 },
  rowSub: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  med: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 11, padding: 12, marginBottom: 8 },
  refill: { backgroundColor: COLORS.mayoBlue, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  refillText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  badge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  empty: { color: COLORS.gray, textAlign: 'center', paddingVertical: 10 },
});
