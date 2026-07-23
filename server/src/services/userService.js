import User from '../models/User.js';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');

  const [postsCount, followersCount, followingCount] = await Promise.all([
    Post.countDocuments({ userId }),
    Follow.countDocuments({ followingId: userId }),
    Follow.countDocuments({ followerId: userId }),
  ]);

  return {
    ...user.toObject(),
    postsCount,
    followersCount,
    followingCount,
  };
};

export const getUserPosts = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  return Post.find({ userId })
    .populate('userId', 'username fullName profileImage')
    .sort({ createdAt: -1 });
};

export const getFollowers = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const follows = await Follow.find({ followingId: userId }).populate(
    'followerId',
    'username fullName profileImage bio'
  );

  return follows.map((f) => f.followerId);
};

export const getFollowing = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const follows = await Follow.find({ followerId: userId }).populate(
    'followingId',
    'username fullName profileImage bio'
  );

  return follows.map((f) => f.followingId);
};
