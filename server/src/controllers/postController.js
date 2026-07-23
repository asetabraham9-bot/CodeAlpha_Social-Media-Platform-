import * as postService from '../services/postService.js';
import * as likeService from '../services/likeService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const enrichPosts = async (posts, userId) => {
  const enriched = await Promise.all(
    posts.map(async (post) => {
      const obj = post.toObject ? post.toObject() : post;
      obj.isLiked = userId ? await likeService.checkUserLiked(post._id, userId) : false;
      return obj;
    })
  );
  return enriched;
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    const enriched = await enrichPosts(posts, req.user?._id);
    successResponse(res, 200, 'Posts retrieved', enriched);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    const obj = post.toObject();
    obj.isLiked = req.user ? await likeService.checkUserLiked(post._id, req.user._id) : false;
    successResponse(res, 200, 'Post retrieved', obj);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return errorResponse(res, 400, 'Post content is required');

    let mediaType = null;
    let mediaUrl = '';

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video/');
      mediaType = isVideo ? 'video' : 'image';
      mediaUrl = isVideo
        ? `/uploads/videos/${req.file.filename}`
        : `/uploads/images/${req.file.filename}`;
    }

    const post = await postService.createPost(req.user._id, { content, mediaType, mediaUrl });
    const populated = await post.populate('userId', 'username fullName profileImage');
    successResponse(res, 201, 'Post created', populated);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.id, req.user._id, req.body);
    successResponse(res, 200, 'Post updated', post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const result = await postService.deletePost(req.params.id, req.user._id);
    successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
