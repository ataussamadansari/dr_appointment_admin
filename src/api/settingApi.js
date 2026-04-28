import { axiosClient } from './axiosClient';

export const getSettings = () => axiosClient.get('/admin/settings').then((r) => r.data.data);
export const updateSettings = (payload) => axiosClient.put('/admin/settings', payload).then((r) => r.data.data);
export const getNextDaySlots = () => axiosClient.get('/admin/next-day-slots').then((r) => r.data.data);
