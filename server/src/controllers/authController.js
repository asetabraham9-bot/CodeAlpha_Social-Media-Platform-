import * as authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const register = async (req, res, next) => {
  try {
    const { username, fullName, email, password } = req.body;
    if (!username || !fullName || !email || !password) {
      return errorResponse(res, 400, 'All fields are required');
    }
    const result = await authService.registerUser({ username, fullName, email, password });
    successResponse(res, 201, 'Registration successful', result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }
    const result = await authService.loginUser({ email, password });
    successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user._id);
    successResponse(res, 200, 'Profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.profileImage = `/uploads/images/${req.file.filename}`;
    }
    const profile = await authService.updateProfile(req.user._id, updates);
    successResponse(res, 200, 'Profile updated', profile);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  successResponse(res, 200, 'Logout successful');
};
