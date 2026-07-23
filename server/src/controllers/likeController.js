import * as likeService from '../services/likeService.js';
import { successResponse } from '../utils/responseHandler.js';

export const likePost = async (req, res, next) => {
  try {
    const result = await likeService.likePost(req.params.id, req.user._id);
    successResponse(res, 200, 'Post liked', result);
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const result = await likeService.unlikePost(req.params.id, req.user._id);
    successResponse(res, 200, 'Post unliked', result);
  } catch (error) {
    next(error);
  }
};

export const getLikes = async (req, res, next) => {
  try {
    const result = await likeService.getPostLikes(req.params.id);
    successResponse(res, 200, 'Likes retrieved', result);
  } catch (error) {
    next(error);
  }
};
