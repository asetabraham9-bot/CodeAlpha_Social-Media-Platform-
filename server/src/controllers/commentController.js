import * as commentService from '../services/commentService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.id);
    successResponse(res, 200, 'Comments retrieved', comments);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return errorResponse(res, 400, 'Comment content is required');
    const comment = await commentService.addComment(req.params.id, req.user._id, content);
    successResponse(res, 201, 'Comment added', comment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return errorResponse(res, 400, 'Comment content is required');
    const comment = await commentService.updateComment(req.params.id, req.user._id, content);
    successResponse(res, 200, 'Comment updated', comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const result = await commentService.deleteComment(req.params.id, req.user._id);
    successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
