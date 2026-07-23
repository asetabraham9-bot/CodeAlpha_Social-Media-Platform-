import { errorResponse } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 400, messages.join(', '));
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 400, `${field} already exists`);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'Invalid ID format');
  }

  if (err.message && err.message.includes('File too large')) {
    return errorResponse(res, 400, 'File size exceeds the allowed limit');
  }

  return errorResponse(res, err.statusCode || 500, err.message || 'Internal server error');
};

export const notFound = (req, res) => {
  errorResponse(res, 404, `Route not found: ${req.originalUrl}`);
};
