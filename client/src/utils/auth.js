// frontend/src/utils/auth.js
import api from '../services/api';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set:', api.defaults.headers.common['Authorization']);
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('Auth token removed');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const refreshAuthState = () => {
  const token = getAuthToken();
  setAuthToken(token);
};