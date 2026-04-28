import { axiosClient } from './axiosClient';

export const loginAdmin = (payload) => axiosClient.post('/auth/admin/login', payload).then((r) => r.data.data);
