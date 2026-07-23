import apiRequest from '../utils/api';

export const postService = {
  getAllPosts: () => apiRequest('/posts'),

  getPost: (id) => apiRequest(`/posts/${id}`),

  createPost: (formData) =>
    apiRequest('/posts', { method: 'POST', body: formData }),

  updatePost: (id, data) =>
    apiRequest(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deletePost: (id) =>
    apiRequest(`/posts/${id}`, { method: 'DELETE' }),

  getComments: (postId) => apiRequest(`/posts/${postId}/comments`),

  addComment: (postId, content) =>
    apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  likePost: (postId) =>
    apiRequest(`/posts/${postId}/like`, { method: 'POST' }),

  unlikePost: (postId) =>
    apiRequest(`/posts/${postId}/like`, { method: 'DELETE' }),
};
