// Native SimBridge — same API as the web bridge (bridge/sim-bridge.js).
// Uses an in-memory EventEmitter pattern + AsyncStorage for state persistence.
//
// HOW TO WIRE UP THE ADMIN SIM (if running an embedded admin tool / WebView):
//   import SimBridge from './src/bridge/SimBridge';
//   SimBridge.on('appointment_requested', data => { ...handle in sim... });
//   SimBridge.triggers.setAppointmentWait(21);
//   SimBridge.triggers.updateBillAmount(310.75);
//
// In screens, fire portal events with:
//   SimBridge.trigger('records_accessed', { section: 'labs' });

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mayo_sim_state';

const SimBridge = {
  _state: {
    appointmentWaitDays: null,
    availableSlots: null,
    billAmount: 248.5,
    patientStatus: 'active',
    patientPriority: 'commercial',
  },
  _listeners: {},

  async init() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) this._state = { ...this._state, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('[SimBridge] init failed', e);
    }
    return this._state;
  },

  async _persist() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('[SimBridge] persist failed', e);
    }
  },

  on(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
    return () => this.off(event, handler);
  },

  off(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter((h) => h !== handler);
  },

  emit(event, data) {
    (this._listeners[event] || []).forEach((h) => {
      try {
        h(data);
      } catch (e) {
        console.error('[SimBridge] listener error', e);
      }
    });
    console.log('[SimBridge]', event, data);
  },

  setState(key, value) {
    this._state[key] = value;
    this._persist();
    this.emit('stateChange', { key, value });
  },

  getState(key) {
    return this._state[key];
  },

  // Portal actions call this to fire portal events (admin sim subscribes).
  trigger(event, data) {
    this.emit(event, { ...data, timestamp: new Date().toISOString() });
  },

  // ─── Admin sim integration points ───
  triggers: {
    setAppointmentWait(days) {
      SimBridge.setState('appointmentWaitDays', days);
    },
    setSlotAvailability(slots) {
      SimBridge.setState('availableSlots', slots);
    },
    pushNotification(message, type) {
      SimBridge.emit('notification', { message, type });
    },
    updateBillAmount(amount) {
      SimBridge.setState('billAmount', amount);
    },
    setPatientPriority(tier) {
      SimBridge.setState('patientPriority', tier);
    },
  },

  portalEvents: [
    'portal_login',
    'appointment_requested',
    'bill_payment_initiated',
    'bill_payment_completed',
    'records_accessed',
    'chatbot_interaction',
    'appointment_cancelled',
    'refill_requested',
    'provider_message_sent',
  ],
};

export default SimBridge;
