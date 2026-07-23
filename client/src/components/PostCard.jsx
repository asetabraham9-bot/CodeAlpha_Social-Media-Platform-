import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './ProfileCard';
import LikeButton from './LikeButton';
import { getMediaUrl } from '../utils/api';

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === comment.userId?._id;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <Link to={`/profile/${comment.userId?._id}`}>
        <Avatar user={comment.userId} size="sm" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <Link
              to={`/profile/${comment.userId?._id}`}
              className="font-semibold text-sm hover:text-primary-600"
            >
              {comment.userId?.fullName}
            </Link>
            <span className="text-xs text-gray-400 ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
      </div>
    </div>
  );
};

const PostCard = ({ post, onDelete, showComments = false }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [showCommentSection, setShowCommentSection] = useState(showComments);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentsCount);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const author = post.userId;
  const isOwner = user?._id === author?._id || user?._id === author;

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const response = await postService.getComments(post._id);
      setComments(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = async () => {
    if (!showCommentSection) {
      await loadComments();
    }
    setShowCommentSection(!showCommentSection);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await postService.addComment(post._id, newComment.trim());
      setComments((prev) => [response.data, ...prev]);
      setCommentCount((prev) => prev + 1);
      setNewComment('');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentCount((prev) => prev - 1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdatePost = async () => {
    try {
      await postService.updatePost(post._id, { content: editContent });
      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postService.deletePost(post._id);
      onDelete?.(post._id);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author?._id}`}>
            <Avatar user={author} />
          </Link>
          <div>
            <Link
              to={`/profile/${author?._id}`}
              className="font-semibold hover:text-primary-600 transition-colors"
            >
              {author?.fullName}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{author?.username} · {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-gray-500 hover:text-primary-600"
            >
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input-field min-h-[80px]"
            />
            <div className="flex gap-2">
              <button onClick={handleUpdatePost} className="btn-primary text-sm py-1.5 px-3">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm py-1.5 px-3">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
        )}
      </div>

      {post.mediaUrl && (
        <div className="mt-4 rounded-lg overflow-hidden">
          {post.mediaType === 'video' ? (
            <video
              src={getMediaUrl(post.mediaUrl)}
              controls
              className="w-full max-h-96 object-contain bg-black"
            />
          ) : (
            <img
              src={getMediaUrl(post.mediaUrl)}
              alt="Post media"
              className="w-full max-h-96 object-cover"
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <LikeButton
          postId={post._id}
          initialLiked={post.isLiked}
          initialCount={post.likesCount}
        />
        <button
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {commentCount}
        </button>
        <Link
          to={`/posts/${post._id}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 ml-auto"
        >
          View post
        </Link>
      </div>

      {showCommentSection && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          {isAuthenticated && (
            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input-field flex-1 py-2"
              />
              <button type="submit" className="btn-primary text-sm py-2 px-4">
                Post
              </button>
            </form>
          )}

          {loadingComments ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))
          )}
        </div>
      )}
    </article>
  );
};

export default PostCard;
