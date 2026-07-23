import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  fullName: user.fullName,
  email: user.email,
  profileImage: user.profileImage,
  bio: user.bio,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async ({ username, fullName, email, password }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Email or username already in use');
  }

  const user = await User.create({ username, fullName, email, password });
  const token = generateToken(user._id);

  return { user: sanitizeUser(user), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  return { user: sanitizeUser(user), token };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return sanitizeUser(user);
};

export const updateProfile = async (userId, updates) => {
  const allowed = ['fullName', 'bio', 'profileImage'];
  const filtered = {};
  allowed.forEach((key) => {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  });

  const user = await User.findByIdAndUpdate(userId, filtered, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new Error('User not found');
  return sanitizeUser(user);
};
