import { Link } from 'react-router-dom';
import { getMediaUrl } from '../utils/api';

const Avatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-3xl',
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (user?.profileImage) {
    return (
      <img
        src={getMediaUrl(user.profileImage)}
        alt={user.fullName}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center font-semibold text-primary-700 dark:text-primary-300 ring-2 ring-gray-200 dark:ring-gray-700`}
    >
      {initials}
    </div>
  );
};

const ProfileCard = ({ user, showFollow = false, FollowComponent }) => {
  return (
    <div className="card p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar user={user} size="xl" />
        <h2 className="mt-4 text-xl font-bold">{user.fullName}</h2>
        <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
        {user.bio && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">{user.bio}</p>
        )}

        <div className="flex gap-6 mt-4 text-sm">
          <div>
            <span className="font-bold">{user.postsCount ?? 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Posts</span>
          </div>
          <Link to={`/profile/${user._id}/followers`} className="hover:text-primary-600">
            <span className="font-bold">{user.followersCount ?? 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
          </Link>
          <Link to={`/profile/${user._id}/following`} className="hover:text-primary-600">
            <span className="font-bold">{user.followingCount ?? 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
          </Link>
        </div>

        {showFollow && FollowComponent}
      </div>
    </div>
  );
};

export { Avatar };
export default ProfileCard;
