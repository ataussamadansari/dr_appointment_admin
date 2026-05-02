import { axiosClient } from './axiosClient';

export const getWhatsappBookings = (params) =>
  axiosClient.get('/admin/whatsapp-bookings', { params }).then((r) => r.data.data);

export const getWhatsappBooking = (id) =>
  axiosClient.get(`/admin/whatsapp-bookings/${id}`).then((r) => r.data.data);
