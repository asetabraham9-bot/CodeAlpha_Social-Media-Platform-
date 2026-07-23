import * as adminService from '../services/adminService.js';
import * as postService from '../services/postService.js';
import * as commentService from '../services/commentService.js';
import { successResponse } from '../utils/responseHandler.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    successResponse(res, 200, 'Users retrieved', users);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await adminService.getAllPostsAdmin();
    successResponse(res, 200, 'Posts retrieved', posts);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user._id, true);
    successResponse(res, 200, 'Post removed by admin');
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const result = await commentService.deleteComment(req.params.id, req.user._id, true);
    successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
