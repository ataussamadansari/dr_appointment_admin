import { axiosClient } from './axiosClient';

export const getAdminToken = (appointmentId) =>
  axiosClient.get(`/agora/admin/token/${appointmentId}`).then((r) => r.data.data);

export const startCall = (appointmentId) =>
  axiosClient.post('/agora/admin/start-call', { appointmentId }).then((r) => r.data.data);

export const endCall = (appointmentId) =>
  axiosClient.post('/agora/admin/end-call', { appointmentId }).then((r) => r.data.data);

export const fetchRecordingUrl = (appointmentId) =>
  axiosClient.get(`/agora/admin/recording/${appointmentId}`).then((r) => r.data.data);
