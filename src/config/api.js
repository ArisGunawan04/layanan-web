// Konfigurasi API untuk aplikasi
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
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
    STORIES: {
      BASE: '/api/stories',
      BY_ID: (storyId) => `/api/stories/${storyId}`,
      USER_STORIES: (userId) => `/api/stories/user/${userId}`,
      VIEW_STORY: (storyId) => `/api/stories/${storyId}/view`,
      UPLOAD: '/api/stories/upload'
    },
    CHATS: {
      BASE: '/api/chats',
      SEND: '/api/chats/send',
      SEND_FILE: '/api/chats/send-file',
      BY_RECIPIENT: (recipientId) => `/api/chats/${recipientId}`
    },
    UPLOADS: {
      CHAT_MEDIA: '/api/upload/chat_media'
    },
    GROUPS: {
      BASE: '/api/groups',
      CREATE: '/api/groups/create',
      MY_GROUPS: '/api/groups/my-groups',
      DETAIL: (groupId) => `/api/groups/${groupId}`,
      UPDATE: (groupId) => `/api/groups/${groupId}`,
      DELETE: (groupId) => `/api/groups/${groupId}`,
      ADD_MEMBER: (groupId) => `/api/groups/${groupId}/members`,
      REMOVE_MEMBER: (groupId, userId) => `/api/groups/${groupId}/members/${userId}`,
      LEAVE: (groupId) => `/api/groups/${groupId}/leave`,
      TRANSFER_ADMIN: (groupId) => `/api/groups/${groupId}/transfer-admin`,
      SEND_MESSAGE: (groupId) => `/api/groups/${groupId}/messages`,
      GET_MESSAGES: (groupId) => `/api/groups/${groupId}/messages`,
      DELETE_MESSAGE: (messageId) => `/api/groups/messages/${messageId}`,
      UPLOAD_MEDIA: (groupId) => `/api/groups/${groupId}/upload`
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