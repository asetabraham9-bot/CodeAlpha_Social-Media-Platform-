import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to MiniSocial
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Connect, share, and engage with your community
        </p>
      </div>

      {isAuthenticated ? (
        <CreatePost onPostCreated={handlePostCreated} />
      ) : (
        <div className="card p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Log in
            </Link>{' '}
            or{' '}
            <Link to="/register" className="text-primary-600 hover:underline font-medium">
              register
            </Link>{' '}
            to create posts and interact with the community.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="card p-6 text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          No posts yet. Be the first to share something!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
