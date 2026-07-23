import apiRequest from '../utils/api';

export const commentService = {
  deleteComment: (id) =>
    apiRequest(`/comments/${id}`, { method: 'DELETE' }),
};
