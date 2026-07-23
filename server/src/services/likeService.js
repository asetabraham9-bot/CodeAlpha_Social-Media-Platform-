import Like from '../models/Like.js';
import Post from '../models/Post.js';

export const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const existing = await Like.findOne({ postId, userId });
  if (existing) throw new Error('Post already liked');

  await Like.create({ postId, userId });
  post.likesCount += 1;
  await post.save();

  return { likesCount: post.likesCount, liked: true };
};

export const unlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const like = await Like.findOneAndDelete({ postId, userId });
  if (!like) throw new Error('Post not liked yet');

  post.likesCount = Math.max(0, post.likesCount - 1);
  await post.save();

  return { likesCount: post.likesCount, liked: false };
};

export const getPostLikes = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const likes = await Like.find({ postId }).populate(
    'userId',
    'username fullName profileImage'
  );

  return { likesCount: post.likesCount, likes };
};

export const checkUserLiked = async (postId, userId) => {
  if (!userId) return false;
  const like = await Like.findOne({ postId, userId });
  return !!like;
};
