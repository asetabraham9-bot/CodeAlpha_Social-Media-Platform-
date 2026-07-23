const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Cannot reach the server. Start the backend with: cd server && npm run dev');
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        response.ok
          ? 'Invalid response from server'
          : `Server error (${response.status})`
      );
    }
  } else if (!response.ok) {
    const unreachable =
      response.status === 502 ||
      response.status === 504 ||
      response.status === 500;
    throw new Error(
      unreachable
        ? 'Cannot reach the server. Start the backend with: cd server && npm run dev'
        : `Request failed with status ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data ?? {};
};

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};

export default apiRequest;
