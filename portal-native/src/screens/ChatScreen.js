import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBot from '../components/ChatBot';
import { COLORS } from '../theme';

// Modal chat screen — wraps the reusable ChatBot component.
export default function ChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ChatBot onClose={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
});
