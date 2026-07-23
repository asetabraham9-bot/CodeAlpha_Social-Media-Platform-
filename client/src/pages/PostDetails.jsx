import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(id);
        setPost(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

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
    <div className="max-w-2xl mx-auto">
      <PostCard post={post} showComments />
    </div>
  );
};

export default PostDetails;
