import api from './axios';

export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getMe = () => api.get('/auth/me');

