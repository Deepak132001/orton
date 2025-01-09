// // client/src/services/auth.service.js
// import api from './api';

// export const register = async (email, password) => {
//   const response = await api.post('/auth/register', { email, password });
//   return response.data;
// };

// export const login = async (email, password) => {
//   const response = await api.post('/auth/login', { email, password });
//   return response.data;
// };

import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};