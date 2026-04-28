import { axiosClient } from './axiosClient';

export const createPrescription = (payload) => axiosClient.post('/prescriptions', payload).then((r) => r.data.data);
export const getPrescriptions = () => axiosClient.get('/prescriptions').then((r) => r.data.data);
export const sendPrescriptionWhatsapp = (id) => axiosClient.post(`/prescriptions/${id}/send-whatsapp`).then((r) => r.data.data);
export const getMedicineSuggestions = (q) => axiosClient.get('/prescriptions/medicine-suggestions', { params: { q } }).then((r) => r.data.data);
