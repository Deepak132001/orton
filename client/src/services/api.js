// client/src/services/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Initialize headers from localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // console.log('Initial token set:', token);
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get current token
    const currentToken = localStorage.getItem('token');
    
    if (currentToken) {
      config.headers['Authorization'] = `Bearer ${currentToken}`;
      // console.log('Request headers set:', config.headers);
    } else {
      // console.log('No token found for request');
    }
    
    return config;
  },
  (error) => {
    // console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


// Export a function to manually set the token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // console.log('Token manually set:', token);
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    // console.log('Token manually removed');
  }
};

export default api;