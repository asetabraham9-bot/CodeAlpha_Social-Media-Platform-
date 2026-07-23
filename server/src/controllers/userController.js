import * as userService from '../services/userService.js';
import * as followService from '../services/followService.js';
import { successResponse } from '../utils/responseHandler.js';

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (req.user) {
      user.isFollowing = await followService.isFollowing(req.user._id, req.params.id);
    }
    successResponse(res, 200, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await userService.getUserPosts(req.params.id);
    successResponse(res, 200, 'User posts retrieved', posts);
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const followers = await userService.getFollowers(req.params.id);
    successResponse(res, 200, 'Followers retrieved', followers);
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const following = await userService.getFollowing(req.params.id);
    successResponse(res, 200, 'Following retrieved', following);
  } catch (error) {
    next(error);
  }
};
