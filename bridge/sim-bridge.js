// SimBridge — connects Patient Portal (patient-facing) with Patient Access Simulator (admin)
//
// HOW TO WIRE UP THE ADMIN SIM:
//   import { SimBridge } from './bridge/sim-bridge.js';
//
//   // 1. Listen for patient-portal events (patient did something):
//   SimBridge.on('appointment_requested', data => {
//     console.log('New request from portal:', data.specialty, data.reason);
//     // ...feed into the simulator queue / metrics...
//   });
//
//   // 2. Push admin-side state INTO the portal (reflected in the patient UI):
//   SimBridge.triggers.setAppointmentWait(21);     // portal shows "~21 day wait"
//   SimBridge.triggers.updateBillAmount(310.75);   // portal updates balance
//   SimBridge.triggers.pushNotification('Your provider added a note', 'info');
//
// The portal and the admin sim may run in the SAME window (shared module) OR in
// SEPARATE frames/tabs. Cross-window communication via postMessage is handled
// automatically at the bottom of this file.

export const SimBridge = {
  _state: {
    appointmentWaitDays: null,
    availableSlots: null,
    billAmount: 248.50,
    patientStatus: 'active',
    patientPriority: 'commercial',
  },
  _listeners: {},

  on(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
    return () => this.off(event, handler);
  },

  off(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(h => h !== handler);
  },

  emit(event, data) {
    (this._listeners[event] || []).forEach(h => {
      try { h(data); } catch (e) { console.error('[SimBridge] listener error', e); }
    });
    // Broadcast to other frames so a separately-hosted portal also receives it.
    if (typeof window !== 'undefined') {
      try { window.postMessage({ portalEvent: event, data }, '*'); } catch (e) {}
    }
    console.log('[SimBridge]', event, data);
  },

  setState(key, value) {
    this._state[key] = value;
    this.emit('stateChange', { key, value });
    // Forward to a portal running in a child frame (if any).
    if (typeof window !== 'undefined') {
      try { window.postMessage({ simCommand: 'setState', key, value }, '*'); } catch (e) {}
    }
  },

  getState(key) { return this._state[key]; },

  // ─── Admin sim integration points ───
  // These let the simulator mutate patient-facing state with intent-named calls.
  triggers: {
    // Admin sim changes appointment wait time → portal shows updated wait
    setAppointmentWait(days) { SimBridge.setState('appointmentWaitDays', days); },
    // Admin sim adjusts capacity → portal shows availability
    setSlotAvailability(slots) { SimBridge.setState('availableSlots', slots); },
    // Push a notification to the patient portal
    pushNotification(message, type) { SimBridge.emit('notification', { message, type }); },
    // Simulate bill update from admin side
    updateBillAmount(amount) { SimBridge.setState('billAmount', amount); },
    // Change patient tier/priority in admin → affects portal messaging
    setPatientPriority(tier) { SimBridge.setState('patientPriority', tier); },
  },

  // Events fired BY the portal that the admin sim can subscribe to via .on()
  portalEvents: [
    'portal_login', 'appointment_requested', 'bill_payment_initiated',
    'bill_payment_completed', 'records_accessed', 'chatbot_interaction',
    'appointment_cancelled', 'refill_requested', 'provider_message_sent'
  ]
};

// Cross-window communication (portal and sim in separate frames/tabs)
if (typeof window !== 'undefined') {
  window.addEventListener('message', (e) => {
    if (e.data?.portalEvent) {
      SimBridge.emit(e.data.portalEvent, e.data.data);
    }
    if (e.data?.simCommand) {
      const { command, payload } = e.data;
      if (SimBridge.triggers[command]) SimBridge.triggers[command](payload);
    }
  });
}

export default SimBridge;
