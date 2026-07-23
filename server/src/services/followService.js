import Follow from '../models/Follow.js';
import User from '../models/User.js';

export const followUser = async (followerId, followingId) => {
  if (followerId.toString() === followingId.toString()) {
    throw new Error('You cannot follow yourself');
  }

  const targetUser = await User.findById(followingId);
  if (!targetUser) throw new Error('User not found');

  const existing = await Follow.findOne({ followerId, followingId });
  if (existing) throw new Error('Already following this user');

  await Follow.create({ followerId, followingId });
  return { message: 'User followed successfully', following: true };
};

export const unfollowUser = async (followerId, followingId) => {
  const follow = await Follow.findOneAndDelete({ followerId, followingId });
  if (!follow) throw new Error('Not following this user');

  return { message: 'User unfollowed successfully', following: false };
};

export const isFollowing = async (followerId, followingId) => {
  if (!followerId || !followingId) return false;
  const follow = await Follow.findOne({ followerId, followingId });
  return !!follow;
};
