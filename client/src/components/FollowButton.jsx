import { useState } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const FollowButton = ({ userId, initialFollowing, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || user?._id === userId) return null;

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = following
        ? await userService.unfollowUser(userId)
        : await userService.followUser(userId);

      setFollowing(response.data.following);
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
      disabled={loading}
      className={`text-sm font-medium py-1.5 px-4 rounded-lg transition-colors ${
        following
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          : 'btn-primary py-1.5 px-4'
      }`}
    >
      {loading ? '...' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
