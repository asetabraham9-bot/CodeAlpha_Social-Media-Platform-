import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const getAllUsers = async () => {
  return User.find().select('-password').sort({ createdAt: -1 });
};

export const getAllPostsAdmin = async () => {
  return Post.find()
    .populate('userId', 'username fullName profileImage email')
    .sort({ createdAt: -1 });
};

export const adminDeletePost = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  await Comment.deleteMany({ postId });
  await Post.findByIdAndDelete(postId);
  return { message: 'Post removed by admin' };
};

export const adminDeleteComment = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
  return { message: 'Comment removed by admin' };
};
