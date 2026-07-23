import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import FollowButton from '../components/FollowButton';
import PostCard from '../components/PostCard';
import { Avatar } from '../components/ProfileCard';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', bio: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          userService.getUser(id),
          userService.getUserPosts(id),
        ]);
        setProfile(userRes.data);
        setPosts(postsRes.data);
        setEditForm({ fullName: userRes.data.fullName, bio: userRes.data.bio || '' });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName);
      formData.append('bio', editForm.bio);
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await authService.updateProfile(formData);
      setProfile((prev) => ({ ...prev, ...response.data }));
      if (isOwnProfile) updateUser(response.data);
      setIsEditing(false);
      setProfileImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="card p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileCard
        user={profile}
        showFollow={!isOwnProfile}
        FollowComponent={
          !isOwnProfile && (
            <div className="mt-4">
              <FollowButton userId={id} initialFollowing={profile.isFollowing} />
            </div>
          )
        }
      />

      {isOwnProfile && (
        <div className="card p-5">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              Edit Profile
            </button>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-field min-h-[80px]"
                  maxLength={500}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Profile Picture</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {isOwnProfile ? 'Your Posts' : `${profile.fullName}'s Posts`}
        </h3>
        {posts.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">No posts yet</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={(postId) => setPosts((prev) => prev.filter((p) => p._id !== postId))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const FollowList = () => {
  const { id } = useParams();
  const location = useLocation();
  const type = location.pathname.includes('/followers') ? 'followers' : 'following';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response =
          type === 'followers'
            ? await userService.getFollowers(id)
            : await userService.getFollowing(id);
        setUsers(response.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [id, type]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold capitalize">{type}</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <div className="card p-6 text-center text-gray-500">No users found</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <Avatar user={user} />
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
