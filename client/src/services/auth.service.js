// client/src/services/auth.service.js
import api from './api';

export const login = async (email, password) => {
  try {
    // console.log('Making login request...');
    const response = await api.post('/auth/login', { email, password });
    
    // console.log('Login response:', response.data);
    const { token, user } = response.data;
    
    if (token) {
      // Set token in localStorage
      localStorage.setItem('token', token);
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // console.log('Token set in localStorage:', localStorage.getItem('token'));
      // console.log('Token set in axios defaults:', api.defaults.headers.common['Authorization']);
    }

    return response.data;
  } catch (error) {
    // console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};