import { successResponse } from '../utils/responseHandler.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No image file provided');
      error.statusCode = 400;
      throw error;
    }
    const url = `/uploads/images/${req.file.filename}`;
    successResponse(res, 200, 'Image uploaded', { url, mediaType: 'image' });
  } catch (error) {
    next(error);
  }
};

export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No video file provided');
      error.statusCode = 400;
      throw error;
    }
    const url = `/uploads/videos/${req.file.filename}`;
    successResponse(res, 200, 'Video uploaded', { url, mediaType: 'video' });
  } catch (error) {
    next(error);
  }
};
