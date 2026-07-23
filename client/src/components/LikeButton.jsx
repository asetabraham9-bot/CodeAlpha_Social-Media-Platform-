import { useState } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const LikeButton = ({ postId, initialLiked, initialCount, onUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isAuthenticated || loading) return;

    setLoading(true);
    try {
      const response = liked
        ? await postService.unlikePost(postId)
        : await postService.likePost(postId);

      setLiked(response.data.liked);
      setCount(response.data.likesCount);
      onUpdate?.(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!isAuthenticated || loading}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        liked
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
      } ${!isAuthenticated ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <svg
        className={`w-5 h-5 ${liked ? 'fill-current' : 'fill-none stroke-current'}`}
        viewBox="0 0 24 24"
        strokeWidth={liked ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count}
    </button>
  );
};

export default LikeButton;
