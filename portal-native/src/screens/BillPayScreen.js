import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import { COLORS, SHADOWS } from '../theme';
import SimBridge from '../bridge/SimBridge';

const HISTORY = [
  { date: 'Mar 14, 2026', desc: 'Office Visit', amount: '$120.00' },
  { date: 'Feb 2, 2026', desc: 'Lab Work', amount: '$85.50' },
  { date: 'Jan 9, 2026', desc: 'Co-pay', amount: '$40.00' },
];

export default function BillPayScreen() {
  const [bill, setBill] = useState(SimBridge.getState('billAmount') || 248.5);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setAmount(`$${(SimBridge.getState('billAmount') || 248.5).toFixed(2)}`);
    const unsub = SimBridge.on('stateChange', ({ key, value }) => {
      if (key === 'billAmount') {
        setBill(value);
        setAmount(`$${Number(value).toFixed(2)}`);
      }
    });
    return unsub;
  }, []);

  const openForm = () => {
    setShowForm(true);
    SimBridge.trigger('bill_payment_initiated', { amount: bill });
  };

  const process = () => {
    SimBridge.trigger('bill_payment_completed', { amount });
    setShowForm(false);
    Alert.alert('Payment Processed', `Payment of ${amount} processed successfully.`);
  };

  return (
    <View style={styles.screen}>
      <Header name="Sarah" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
        <Text style={styles.title}>Billing & Payments</Text>

        <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
          <Text style={styles.lbl}>OUTSTANDING BALANCE</Text>
          <Text style={styles.amt}>${bill.toFixed(2)}</Text>
          <Text style={styles.sub}>Visit date: April 28, 2026</Text>
          <TouchableOpacity style={styles.payBtn} onPress={openForm}>
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Details</Text>
            <Field label="AMOUNT" value={amount} onChangeText={setAmount} />
            <Field label="CARD NUMBER" placeholder="1234 5678 9012 3456" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}><Field label="EXPIRY" placeholder="MM/YY" /></View>
              <View style={{ flex: 1 }}><Field label="CVV" placeholder="123" /></View>
            </View>
            <Field label="BILLING ZIP" placeholder="55905" />
            <TouchableOpacity style={styles.payBtn} onPress={process}>
              <Text style={styles.payText}>Process Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.section}>Payment History</Text>
        <View style={styles.card}>
          {HISTORY.map((h, i) => (
            <View key={h.date} style={[styles.row, i === HISTORY.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={[styles.cell, { flex: 1.2 }]}>{h.date}</Text>
              <Text style={[styles.cell, { flex: 1.5 }]}>{h.desc}</Text>
              <Text style={[styles.cell, { fontWeight: '700' }]}>{h.amount}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Insurance on File</Text>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.insLogo}><Text style={styles.insLogoText}>BC</Text></View>
            <View>
              <Text style={styles.insName}>BlueCross BlueShield PPO</Text>
              <Text style={styles.rowSub}>Member ID: ••••7841 · Active</Text>
            </View>
          </View>
        </View>

        <Text style={styles.link}>Apply for Financial Assistance →</Text>
      </ScrollView>
    </View>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.mayoLight },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.mayoNavy, marginBottom: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, ...SHADOWS.card },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.mayoNavy, marginBottom: 10 },
  lbl: { fontSize: 12, color: COLORS.gray, letterSpacing: 0.5, fontWeight: '700' },
  amt: { fontSize: 44, fontWeight: '800', color: COLORS.mayoBlue, marginVertical: 6 },
  sub: { color: COLORS.gray, fontSize: 13 },
  payBtn: { backgroundColor: COLORS.mayoBlue, borderRadius: 9, paddingVertical: 13, alignItems: 'center', marginTop: 16, alignSelf: 'stretch' },
  payText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: COLORS.gray, marginBottom: 5, letterSpacing: 0.5 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.mayoNavy, marginTop: 4, marginBottom: 8 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  cell: { fontSize: 14, color: COLORS.text, flex: 1 },
  rowSub: { fontSize: 13, color: COLORS.gray },
  insLogo: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.mayoNavy, alignItems: 'center', justifyContent: 'center' },
  insLogoText: { color: COLORS.white, fontWeight: '700' },
  insName: { fontWeight: '700', color: COLORS.mayoNavy },
  link: { color: COLORS.mayoBlue, marginTop: 8, fontWeight: '600' },
});
