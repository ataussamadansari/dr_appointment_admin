import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getAppointments } from '../api/appointmentApi';
import { useAuth } from '../hooks/useAuth.js';

const NotificationContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [toasts, setToasts] = useState([]);
  const [callingAppointments, setCallingAppointments] = useState([]);

  const socketRef = useRef(null);
  // Track previously seen statuses to avoid duplicate toasts
  const prevStatuses = useRef({});

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

  // ── Initial load — populate calling appointments & prev statuses ──────────
  const loadInitial = useCallback(async () => {
    try {
      const data = await getAppointments({});
      setCallingAppointments(data.filter((a) => a.status === 'calling'));
      data.forEach((a) => { prevStatuses.current[a._id] = a.status; });
    } catch (_) {}
  }, []);

  // ── Handle incoming socket event ──────────────────────────────────────────
  const handleAppointmentNew = useCallback((appt) => {
    prevStatuses.current[appt._id] = appt.status;
    addToast({
      type: 'info',
      title: 'New appointment booked',
      message: `${appt.patientSnapshot?.name} · Token ${appt.tokenNumber} · ₹${appt.feeAmount}`,
      appointmentId: appt._id,
      duration: 8000,
    });
  }, [addToast]);

  const handleAppointmentUpdated = useCallback((appt) => {
    const prev = prevStatuses.current[appt._id];
    prevStatuses.current[appt._id] = appt.status;

    // Update calling list
    setCallingAppointments((list) => {
      if (appt.status === 'calling') {
        const exists = list.find((a) => a._id === appt._id);
        return exists ? list : [...list, appt];
      }
      return list.filter((a) => a._id !== appt._id);
    });

    if (prev === appt.status) return; // no change, skip toast

    if (prev === 'payment_pending' && appt.status === 'confirmed') {
      addToast({
        type: 'success',
        title: 'Payment confirmed',
        message: `${appt.patientSnapshot?.name} · Token ${appt.tokenNumber}`,
        appointmentId: appt._id,
        duration: 6000,
      });
    } else if (appt.status === 'calling') {
      addToast({
        type: 'call',
        title: 'Call started',
        message: `${appt.patientSnapshot?.name} · Token ${appt.tokenNumber}`,
        appointmentId: appt._id,
        duration: 10000,
      });
    } else if (appt.status === 'cancelled') {
      addToast({
        type: 'error',
        title: 'Appointment cancelled',
        message: `${appt.patientSnapshot?.name} · Token ${appt.tokenNumber}`,
        appointmentId: appt._id,
        duration: 6000,
      });
    } else if (appt.status === 'completed') {
      addToast({
        type: 'success',
        title: 'Call completed',
        message: `${appt.patientSnapshot?.name} · Token ${appt.tokenNumber}`,
        appointmentId: appt._id,
        duration: 5000,
      });
    }
  }, [addToast]);

  // ── Connect / disconnect socket ───────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setCallingAppointments([]);
      prevStatuses.current = {};
      return;
    }

    loadInitial();

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      socket.emit('join', 'admin'); // join admin room
    });

    socket.on('appointment:new', handleAppointmentNew);
    socket.on('appointment:updated', handleAppointmentUpdated);

    socketRef.current = socket;

    return () => {
      socket.off('appointment:new', handleAppointmentNew);
      socket.off('appointment:updated', handleAppointmentUpdated);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, loadInitial, handleAppointmentNew, handleAppointmentUpdated]);

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
