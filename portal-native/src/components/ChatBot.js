// Reusable chatbot logic + UI. Same keyword responses as the web portal.
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import SimBridge from '../bridge/SimBridge';

const GREETING =
  "Hello! I'm your Mayo Clinic virtual assistant. I can help you navigate the portal, find information about your care, or connect you with support. How can I help you today?";

const QUICK_REPLIES = ['My Appointments', 'My Bills', 'My Records', 'Talk to a Person'];

export function botResponse(text) {
  const q = text.toLowerCase();
  if (q.includes('talk to a person') || q.includes('human') || q.includes('representative'))
    return "I'll connect you with a patient services representative. Our support hours are Monday–Friday 7am–7pm CT. Phone: 1-800-MAYO-CLINIC";
  if (q.includes('appointment') || q.includes('appt') || q.includes('schedule'))
    return 'You have an upcoming appointment with Dr. Michael Chen on June 15, 2026 at 2:30 PM. Would you like to reschedule or get directions?';
  if (q.includes('bill') || q.includes('pay') || q.includes('balance'))
    return 'Your current outstanding balance is $248.50 from your April 28 visit. I can direct you to the billing section to pay online.';
  if (q.includes('medication') || q.includes('prescription') || q.includes('refill'))
    return 'You have 3 active medications on file. You can request refills through the Medical Records → Medications section.';
  if (q.includes('records') || q.includes('lab') || q.includes('result'))
    return 'Your most recent lab work was a Complete Blood Count on June 1, 2026, which came back Normal. You can view full details in the Medical Records section.';
  if (q.includes('doctor') || q.includes('provider') || q.includes('chen'))
    return "Dr. Michael Chen is your primary cardiologist. He's available for secure messaging through the portal.";
  return 'I can help you with appointments, billing, medical records, medications, and more. You can also reach our support line at 1-800-MAYO-CLINIC.';
}

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([{ id: '1', who: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const push = (who, text) => {
    setMessages((prev) => {
      const next = [...prev, { id: String(prev.length + 1) + who, who, text }];
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
      return next;
    });
  };

  const send = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setInput('');
    push('user', text);
    SimBridge.trigger('chatbot_interaction', { message: text });
    const reply = botResponse(text);
    setTimeout(() => push('bot', reply), 450);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.head}>
        <View>
          <Text style={styles.headTitle}>Mayo Clinic Assistant</Text>
          <Text style={styles.headSub}>Virtual support · online</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={listRef}
        style={styles.body}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.who === 'bot' ? styles.bot : styles.user]}>
            <Text style={item.who === 'bot' ? styles.botText : styles.userText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.chips}>
        {QUICK_REPLIES.map((c) => (
          <TouchableOpacity key={c} style={styles.chip} onPress={() => send(c)}>
            <Text style={styles.chipText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message…"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send()}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => send()}>
          <Ionicons name="send" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.white },
  head: {
    backgroundColor: COLORS.mayoBlue,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headTitle: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  headSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  body: { flex: 1, backgroundColor: COLORS.mayoLight },
  msg: { maxWidth: '82%', padding: 10, borderRadius: 14 },
  bot: { backgroundColor: COLORS.white, alignSelf: 'flex-start', borderBottomLeftRadius: 4, ...SHADOWS.card },
  user: { backgroundColor: COLORS.mayoBlue, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botText: { color: COLORS.text, fontSize: 14, lineHeight: 19 },
  userText: { color: COLORS.white, fontSize: 14, lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 12, paddingTop: 8 },
  chip: {
    borderWidth: 1.5,
    borderColor: COLORS.mayoBlue,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { color: COLORS.mayoBlue, fontWeight: '600', fontSize: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.mayoBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
