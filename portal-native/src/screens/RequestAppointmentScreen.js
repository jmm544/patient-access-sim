import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import SimBridge from '../bridge/SimBridge';

const SPECIALTIES = ['Cardiology', 'Primary Care', 'Dermatology', 'Orthopedics', 'Neurology', 'Endocrinology', 'Gastroenterology'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'No preference'];
const PROVIDERS = ['Dr. Michael Chen, MD', 'No preference', 'First available'];
const LOCATIONS = ['Mayo Clinic Rochester', 'Mayo Clinic Phoenix', 'Mayo Clinic Jacksonville', 'Telehealth'];

function Picker({ options, value, onChange }) {
  return (
    <View style={styles.pickerWrap}>
      {options.map((o) => (
        <TouchableOpacity
          key={o}
          style={[styles.pickOpt, value === o && styles.pickOptActive]}
          onPress={() => onChange(o)}
        >
          <Text style={[styles.pickText, value === o && styles.pickTextActive]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RequestAppointmentScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    specialty: 'Cardiology', reason: '', d1: '', d2: '', d3: '',
    time: 'Morning', provider: 'Dr. Michael Chen, MD', location: 'Mayo Clinic Rochester',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    SimBridge.trigger('appointment_requested', {
      specialty: form.specialty, reason: form.reason,
      provider: form.provider, location: form.location,
    });
    setDone(true);
  };

  const next = () => (step === 4 ? submit() : setStep(step + 1));

  return (
    <View style={styles.screen}>
      <View style={styles.head}>
        <Text style={styles.headTitle}>Request Appointment</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {done ? (
        <View style={styles.success}>
          <View style={styles.check}><Ionicons name="checkmark" size={34} color={COLORS.green} /></View>
          <Text style={styles.successTitle}>Request Submitted</Text>
          <Text style={styles.successSub}>
            Your request has been submitted. We'll contact you within 1 business day.
          </Text>
          <TouchableOpacity style={styles.cta} onPress={() => navigation.goBack()}>
            <Text style={styles.ctaText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.dots}>
            {[1, 2, 3, 4].map((d) => (
              <View key={d} style={[styles.dot, d <= step && styles.dotActive]} />
            ))}
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {step === 1 && (
              <>
                <Text style={styles.label}>Specialty</Text>
                <Picker options={SPECIALTIES} value={form.specialty} onChange={(v) => set('specialty', v)} />
              </>
            )}
            {step === 2 && (
              <>
                <Text style={styles.label}>Reason for Visit</Text>
                <TextInput
                  style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Briefly describe your symptoms or reason…"
                  value={form.reason}
                  onChangeText={(v) => set('reason', v)}
                />
              </>
            )}
            {step === 3 && (
              <>
                <Text style={styles.label}>Preferred Date 1</Text>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.d1} onChangeText={(v) => set('d1', v)} />
                <Text style={styles.label}>Preferred Date 2</Text>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.d2} onChangeText={(v) => set('d2', v)} />
                <Text style={styles.label}>Preferred Date 3</Text>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.d3} onChangeText={(v) => set('d3', v)} />
                <Text style={styles.label}>Time Preference</Text>
                <Picker options={TIMES} value={form.time} onChange={(v) => set('time', v)} />
              </>
            )}
            {step === 4 && (
              <>
                <Text style={styles.label}>Provider Preference</Text>
                <Picker options={PROVIDERS} value={form.provider} onChange={(v) => set('provider', v)} />
                <Text style={styles.label}>Location Preference</Text>
                <Picker options={LOCATIONS} value={form.location} onChange={(v) => set('location', v)} />
              </>
            )}
          </ScrollView>

          <View style={styles.navRow}>
            {step > 1 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.cta, { flex: 1 }]} onPress={next}>
              <Text style={styles.ctaText}>{step === 4 ? 'Submit Request' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50 },
  headTitle: { fontSize: 20, fontWeight: '700', color: COLORS.mayoNavy },
  dots: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginBottom: 6 },
  dot: { flex: 1, height: 5, borderRadius: 999, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.mayoBlue },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.gray, marginBottom: 6, marginTop: 10, letterSpacing: 0.5 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, marginBottom: 4 },
  pickerWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickOpt: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 10 },
  pickOptActive: { backgroundColor: COLORS.mayoBlue, borderColor: COLORS.mayoBlue },
  pickText: { color: COLORS.text, fontWeight: '600' },
  pickTextActive: { color: COLORS.white },
  navRow: { flexDirection: 'row', gap: 10, padding: 16 },
  backBtn: { borderWidth: 1.5, borderColor: COLORS.mayoBlue, borderRadius: 9, paddingHorizontal: 20, justifyContent: 'center' },
  backText: { color: COLORS.mayoBlue, fontWeight: '700' },
  cta: { backgroundColor: COLORS.mayoBlue, borderRadius: 9, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.greenBg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: '700', color: COLORS.mayoNavy, marginBottom: 8 },
  successSub: { color: COLORS.gray, textAlign: 'center', lineHeight: 21, marginBottom: 22 },
});
