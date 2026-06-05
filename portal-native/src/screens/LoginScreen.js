import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import SimBridge from '../bridge/SimBridge';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const enter = () => {
    SimBridge.trigger('portal_login', { patient: 'Sarah Johnson', mrn: 'MRN-2024-00847' });
    navigation.replace('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="add" size={26} color={COLORS.white} />
          </View>
          <Text style={styles.brandText}>Mayo Clinic</Text>
        </View>
        <Text style={styles.sub}>Patient Portal</Text>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>Demo Mode — Enter as Sarah Johnson</Text>
          <TouchableOpacity style={styles.enterBtn} onPress={enter}>
            <Text style={styles.enterText}>Enter Demo Portal →</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signIn} onPress={enter}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <Text style={styles.link}>Forgot Password?</Text>
          <Text style={styles.link}>New User? Sign Up</Text>
          <Text style={styles.link}>Support</Text>
        </View>
      </View>
      <Text style={styles.footer}>© 2026 Mayo Clinic. Simulation environment.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', backgroundColor: COLORS.mayoNavy, padding: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 18, padding: 24, ...SHADOWS.lg },
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logo: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: COLORS.mayoBlue,
    alignItems: 'center', justifyContent: 'center',
  },
  brandText: { fontSize: 24, fontWeight: '800', color: COLORS.mayoNavy },
  sub: { textAlign: 'center', color: COLORS.gray, marginBottom: 20, marginTop: 4 },
  banner: { backgroundColor: COLORS.mayoBlue, borderRadius: 14, padding: 16, marginBottom: 20 },
  bannerText: { color: COLORS.white, textAlign: 'center', marginBottom: 12, fontWeight: '600' },
  enterBtn: { backgroundColor: COLORS.white, borderRadius: 9, paddingVertical: 11, alignItems: 'center' },
  enterText: { color: COLORS.mayoBlue, fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.gray, marginBottom: 5, letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 9,
    paddingHorizontal: 12, paddingVertical: 11, marginBottom: 14, fontSize: 15,
  },
  signIn: { backgroundColor: COLORS.mayoBlue, borderRadius: 9, paddingVertical: 13, alignItems: 'center' },
  signInText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, flexWrap: 'wrap' },
  link: { color: COLORS.mayoBlue, fontSize: 12 },
  footer: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 18, fontSize: 12 },
});
