import apiRequest from '../utils/api';

export const adminService = {
  getUsers: () => apiRequest('/admin/users'),

  getPosts: () => apiRequest('/admin/posts'),

  deletePost: (id) =>
    apiRequest(`/admin/posts/${id}`, { method: 'DELETE' }),

  deleteComment: (id) =>
    apiRequest(`/admin/comments/${id}`, { method: 'DELETE' }),
};
