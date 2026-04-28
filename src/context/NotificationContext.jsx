import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getAppointments } from '../api/appointmentApi';
import { useAuth } from '../hooks/useAuth.js';

const NotificationContext = createContext(null);

// Statuses admin cares about tracking
const WATCH_STATUSES = ['confirmed', 'payment_pending'];

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [toasts, setToasts] = useState([]);
  const [callingAppointments, setCallingAppointments] = useState([]);

  // Track previously seen appointments to detect new ones
  const prevAppointmentIds = useRef(new Set());
  const prevStatuses = useRef({});       // { appointmentId: status }
  const timerRef = useRef(null);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [{ id, ...toast }, ...prev].slice(0, 15));
    if (toast.type !== 'error') {
      setTimeout(() => dismissToast(id), toast.duration ?? 6000);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = addToast;
  const dismissNotification = dismissToast;
  const notifications = toasts;
  const clearAll = useCallback(() => setToasts([]), []);

  // ── Poll — detect new bookings & payment confirmations ────────────────────
  const poll = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getAppointments({});

      // Update calling appointments for navbar badge
      setCallingAppointments(data.filter((a) => a.status === 'calling'));

      // Detect new appointments (just booked / payment pending)
      data.forEach((a) => {
        const isNew = !prevAppointmentIds.current.has(a._id);
        const prevStatus = prevStatuses.current[a._id];
        const statusChanged = prevStatus && prevStatus !== a.status;

        if (isNew && WATCH_STATUSES.includes(a.status)) {
          // Brand new appointment appeared
          addToast({
            type: 'info',
            title: 'New appointment booked',
            message: `${a.patientSnapshot?.name} · Token ${a.tokenNumber} · ₹${a.feeAmount}`,
            appointmentId: a._id,
            duration: 8000,
          });
        } else if (statusChanged) {
          // Payment confirmed
          if (prevStatus === 'payment_pending' && a.status === 'confirmed') {
            addToast({
              type: 'success',
              title: 'Payment confirmed',
              message: `${a.patientSnapshot?.name} · Token ${a.tokenNumber}`,
              appointmentId: a._id,
              duration: 6000,
            });
          }
          // Appointment cancelled
          if (a.status === 'cancelled') {
            addToast({
              type: 'error',
              title: 'Appointment cancelled',
              message: `${a.patientSnapshot?.name} · Token ${a.tokenNumber}`,
              appointmentId: a._id,
              duration: 6000,
            });
          }
        }

        prevStatuses.current[a._id] = a.status;
      });

      // Update seen IDs
      data.forEach((a) => prevAppointmentIds.current.add(a._id));
    } catch (_) {}
  }, [isAuthenticated, addToast]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearInterval(timerRef.current);
      setCallingAppointments([]);
      prevAppointmentIds.current = new Set();
      prevStatuses.current = {};
      return;
    }
    // First poll — populate prevIds without showing notifications (avoid spam on login)
    getAppointments({}).then((data) => {
      data.forEach((a) => {
        prevAppointmentIds.current.add(a._id);
        prevStatuses.current[a._id] = a.status;
      });
      setCallingAppointments(data.filter((a) => a.status === 'calling'));
    }).catch(() => {});

    timerRef.current = setInterval(poll, 10000);
    return () => clearInterval(timerRef.current);
  }, [isAuthenticated, poll]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      toasts,
      addNotification,
      addToast,
      dismissNotification,
      dismissToast,
      clearAll,
      callingAppointments,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
