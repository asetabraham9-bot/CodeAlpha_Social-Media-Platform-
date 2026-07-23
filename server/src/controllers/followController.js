import * as followService from '../services/followService.js';
import { successResponse } from '../utils/responseHandler.js';

export const followUser = async (req, res, next) => {
  try {
    const result = await followService.followUser(req.user._id, req.params.id);
    successResponse(res, 200, result.message, result);
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const result = await followService.unfollowUser(req.user._id, req.params.id);
    successResponse(res, 200, result.message, result);
  } catch (error) {
    next(error);
  }
};
