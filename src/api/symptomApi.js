import { axiosClient } from './axiosClient';

export const listSymptoms = () => axiosClient.get('/symptoms/admin').then((r) => r.data.data);
export const createSymptom = (payload) => axiosClient.post('/symptoms/admin', payload).then((r) => r.data.data);
export const updateSymptom = (id, payload) => axiosClient.put(`/symptoms/admin/${id}`, payload).then((r) => r.data.data);
export const deleteSymptom = (id) => axiosClient.delete(`/symptoms/admin/${id}`).then((r) => r.data.data);
