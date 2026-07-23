import { errorResponse } from '../utils/responseHandler.js';

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 403, 'Access denied. Admin privileges required.');
};
