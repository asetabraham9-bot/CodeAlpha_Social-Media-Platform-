import { useState } from 'react';
import { postService } from '../services/postService';
import { Avatar } from './ProfileCard';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setMedia(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (media) formData.append('media', media);

      const response = await postService.createPost(formData);
      setContent('');
      setMedia(null);
      setPreview(null);
      onPostCreated?.(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar user={user} />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="input-field min-h-[100px] resize-none"
              maxLength={2000}
            />
          </div>
        </div>

        {preview && (
          <div className="mt-3 relative">
            {media?.type.startsWith('video/') ? (
              <video src={preview} controls className="w-full max-h-64 rounded-lg" />
            ) : (
              <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
            )}
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Add photo/video
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime,video/webm"
              onChange={handleMediaChange}
              className="hidden"
            />
          </label>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
