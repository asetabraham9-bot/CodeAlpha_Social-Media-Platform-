import apiRequest from '../utils/api';

export const userService = {
  getUser: (id) => apiRequest(`/users/${id}`),

  getUserPosts: (id) => apiRequest(`/users/${id}/posts`),

  getFollowers: (id) => apiRequest(`/users/${id}/followers`),

  getFollowing: (id) => apiRequest(`/users/${id}/following`),

  followUser: (id) =>
    apiRequest(`/users/${id}/follow`, { method: 'POST' }),

  unfollowUser: (id) =>
    apiRequest(`/users/${id}/follow`, { method: 'DELETE' }),
};
