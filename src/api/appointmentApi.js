import { axiosClient } from './axiosClient';

export const getAppointments = (params) => axiosClient.get('/admin/appointments', { params }).then((r) => r.data.data);
export const getAppointment = (id) => axiosClient.get(`/admin/appointments/${id}`).then((r) => r.data.data);
export const updateAppointmentStatus = (id, status) => axiosClient.patch(`/admin/appointments/${id}/status`, { status }).then((r) => r.data.data);
export const getRecordings = (params) => axiosClient.get('/admin/recordings', { params }).then((r) => r.data.data);
