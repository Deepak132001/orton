// src/services/youtube.service.js
import api from './api';

export const connectYouTubeChannel = async (code) => {
  try {
    const response = await api.post('/youtube/connect', { code });
    return response.data;
  } catch (error) {
    console.error('YouTube connect error:', error.response?.data || error.message);
    throw error;
  }
};

export const getYouTubeProfile = async () => {
  try {
    const response = await api.get('/youtube/profile');
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      return { connected: false, data: null };
    }
    throw error;
  }
};

export const getChannelInfo = async (channelId) => {
  try {
    const response = await api.get(`/youtube/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel info:', error);
    throw error;
  }
};


export const generateContentIdeas = async (channelId) => {
  try {
    const response = await api.post('/youtube/generate-ideas', { channelId });
    return response.data.ideas;
  } catch (error) {
    console.error('Error generating content ideas:', error);
    throw error;
  }
};

export const getVideoTranscriptions = async (videoId) => {
  try {
    const response = await api.get(`/youtube/transcriptions/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transcriptions:', error);
    throw error;
  }
};

export const generateVideoScript = async ({ topic, duration, channelId }) => {
  try {
    const response = await api.post('/youtube/generate-script', {
      topic,
      duration,
      channelId
    });
    return response.data;
  } catch (error) {
    console.error('Error generating video script:', error);
    throw error;
  }
};


export const disconnectYouTube = async () => {
  try {
    const response = await api.post('/youtube/disconnect');
    return response.data;
  } catch (error) {
    console.error('Error disconnecting YouTube:', error);
    throw error;
  }
};

export const getUploadTiming = async () => {
  try {
    const response = await api.get('/youtube/best-times');
    return response.data;
  } catch (error) {
    throw error;
  }
};