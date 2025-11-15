import api from './axios';

export const updateFeedbackStatus = (id, status) => 
  api.put(`/admin/feedback/${id}/status`, { status });
export const deleteAnyFeedback = (id) => api.delete(`/admin/feedback/${id}`);
export const getStats = () => api.get('/admin/stats');
export const getUsers = () => api.get('/admin/users');

