// Custom bottom tab bar with Mayo-blue active state.
// Pass this to Tab.Navigator as: tabBar={(props) => <BottomNav {...props} />}
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme';

const ICONS = {
  Home: 'home-outline',
  Appointments: 'calendar-outline',
  Records: 'document-text-outline',
  Billing: 'card-outline',
  Account: 'person-outline',
};

export default function BottomNav({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 6 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;
        const color = focused ? COLORS.mayoBlue : COLORS.gray;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} style={styles.btn} onPress={onPress}>
            <Ionicons name={ICONS[route.name] || 'ellipse-outline'} size={23} color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 6,
  },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { fontSize: 11, fontWeight: '600' },
});
