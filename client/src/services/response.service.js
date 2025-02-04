// Frontend: Response Service (src/services/response.service.js)
import api from './api';

export const saveGeneratedResponse = async (content, type) => {
  const response = await api.post('/responses', { content, type });
  return response.data;
};

export const getResponses = async () => {
  const response = await api.get('/responses');
  return response.data;
};

export const deleteGeneratedResponse = async (responseId) => {
  const response = await api.delete(`/responses/${responseId}`);
  return response.data;
};
