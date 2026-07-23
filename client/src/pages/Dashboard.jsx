import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { Avatar } from '../components/ProfileCard';
import { getMediaUrl } from '../utils/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getPosts(),
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Remove this post?')) return;
    try {
      await adminService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error(error.message);
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'posts', label: 'Posts', count: posts.length },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : activeTab === 'users' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} size="sm" />
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-gray-500 text-xs">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar user={post.userId} size="sm" />
                    <span className="font-medium text-sm">{post.userId?.fullName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                  {post.mediaUrl && (
                    <div className="mt-2">
                      {post.mediaType === 'video' ? (
                        <video src={getMediaUrl(post.mediaUrl)} controls className="max-h-40 rounded" />
                      ) : (
                        <img src={getMediaUrl(post.mediaUrl)} alt="" className="max-h-40 rounded object-cover" />
                      )}
                    </div>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>{post.likesCount} likes</span>
                    <span>{post.commentsCount} comments</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="btn-danger text-xs py-1.5 px-3 shrink-0"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
