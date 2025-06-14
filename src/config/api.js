// Konfigurasi API untuk aplikasi
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register'
    },
    USERS: {
      BASE: '/api/users',
      PROFILE: (id) => `/api/users/${id}`,
      STATUS: '/api/users/status'
    },
    POSTS: {
      BASE: '/api/posts',
      BY_ID: (id) => `/api/posts/${id}`
    },
    COMMENTS: {
      BASE: '/api/comments',
      BY_POST: (postId) => `/api/comments/post/${postId}`
    },
    LIKES: {
      BASE: '/api/likes',
      BY_POST: (postId) => `/api/likes/${postId}`
    },
    CHATS: {
      BASE: '/api/chats',
      SEND: '/api/chats/send',
      SEND_FILE: '/api/chats/send-file',
      BY_RECIPIENT: (recipientId) => `/api/chats/${recipientId}`
    },
    UPLOADS: {
      CHAT_MEDIA: '/api/upload/chat_media'
    }
  }
};

// Helper function untuk membuat URL lengkap
export const createApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function untuk membuat headers dengan authorization
export const createAuthHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function untuk membuat headers untuk file upload
export const createFileUploadHeaders = () => {
  const headers = {};
  
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export default API_CONFIG;