import api from './axios';

export const createFeedback = (data) => api.post('/feedback', data);
export const getFeedbacks = (params) => api.get('/feedback', { params });
export const getFeedback = (id) => api.get(`/feedback/${id}`);
export const updateFeedback = (id, data) => api.put(`/feedback/${id}`, data);
export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);
export const toggleUpvote = (id) => api.post(`/feedback/${id}/upvote`);

