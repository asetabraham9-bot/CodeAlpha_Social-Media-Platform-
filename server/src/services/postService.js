import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

export const getAllPosts = async () => {
  return Post.find()
    .populate('userId', 'username fullName profileImage')
    .sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate(
    'userId',
    'username fullName profileImage'
  );
  if (!post) throw new Error('Post not found');
  return post;
};

export const createPost = async (userId, { content, mediaType, mediaUrl }) => {
  return Post.create({
    userId,
    content,
    mediaType: mediaType || null,
    mediaUrl: mediaUrl || '',
  });
};

export const updatePost = async (postId, userId, { content, mediaType, mediaUrl }) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  if (post.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to edit this post');
  }

  if (content !== undefined) post.content = content;
  if (mediaType !== undefined) post.mediaType = mediaType;
  if (mediaUrl !== undefined) post.mediaUrl = mediaUrl;

  await post.save();
  return post.populate('userId', 'username fullName profileImage');
};

export const deletePost = async (postId, userId, isAdmin = false) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this post');
  }

  await Promise.all([
    Comment.deleteMany({ postId }),
    Like.deleteMany({ postId }),
    Post.findByIdAndDelete(postId),
  ]);

  return { message: 'Post deleted successfully' };
};
