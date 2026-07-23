import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const getCommentsByPost = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  return Comment.find({ postId })
    .populate('userId', 'username fullName profileImage')
    .sort({ createdAt: -1 });
};

export const addComment = async (postId, userId, content) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const comment = await Comment.create({ postId, userId, content });
  post.commentsCount += 1;
  await post.save();

  return comment.populate('userId', 'username fullName profileImage');
};

export const updateComment = async (commentId, userId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');
  if (comment.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to edit this comment');
  }

  comment.content = content;
  await comment.save();
  return comment.populate('userId', 'username fullName profileImage');
};

export const deleteComment = async (commentId, userId, isAdmin = false) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  if (!isAdmin && comment.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this comment');
  }

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });

  return { message: 'Comment deleted successfully' };
};
