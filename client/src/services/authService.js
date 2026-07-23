import apiRequest from '../utils/api';

export const authService = {
  register: (userData) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  login: (credentials) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (formData) =>
    apiRequest('/auth/profile', { method: 'PUT', body: formData }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};
