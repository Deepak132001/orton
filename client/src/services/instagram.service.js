// // client/src/services/instagram.service.js
// import api from './api';

// export const connectInstagramAccount = async (accessToken) => {
//   try {
//     console.log('Connecting with token:', accessToken);
//     const response = await api.post('/instagram/connect', {
//       accessToken: accessToken
//     });
//     console.log('Connect response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Instagram Connect Error:', {
//       message: error.response?.data?.message,
//       details: error.response?.data?.details,
//       error: error.response?.data
//     });
//     throw error;
//   }
// };

// export const getInstagramProfile = async () => {
//   try {
//     console.log('Fetching Instagram profile...');
//     const response = await api.get('/instagram/profile');
//     console.log('Profile response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Get Profile Error:', {
//       message: error.response?.data?.message,
//       details: error.response?.data?.details,
//       error: error.response?.data
//     });
//     throw error;
//   }
// };

// export const getInstagramInsights = async () => {
//   try {
//     console.log('Fetching Instagram insights...');
//     const response = await api.get('/instagram/insights');
//     console.log('Insights response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Get Insights Error:', {
//       message: error.response?.data?.message,
//       details: error.response?.data?.details,
//       error: error.response?.data
//     });
//     throw error;
//   }
// };

// export const disconnectInstagramAccount = async () => {
//   try {
//     const response = await api.post('/instagram/disconnect');
//     console.log('Disconnect response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Disconnect Error:', error.response?.data);
//     throw error;
//   }
// };


// client/src/services/instagram.service.js

import api from './api';

export const connectInstagramAccount = async (accessToken) => {
  try {
    const response = await api.post('/instagram/connect', { accessToken });
    return response.data;
  } catch (error) {
    console.error('Instagram Connect Error:', {
      message: error.response?.data?.message,
      details: error.response?.data?.details,
      error: error.response?.data
    });
    throw error;
  }
};

export const getInstagramProfile = async () => {
  try {
    console.log('Fetching Instagram profile...');
    const response = await api.get('/instagram/profile');
    console.log('Profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Profile Error:', {
      message: error.response?.data?.message,
      details: error.response?.data?.details,
      error: error.response?.data
    });
    throw error;
  }
};

export const getInstagramInsights = async () => {
  try {
    console.log('Fetching Instagram insights...');
    const response = await api.get('/instagram/insights');
    console.log('Insights response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Insights Error:', {
      message: error.response?.data?.message,
      details: error.response?.data?.details,
      error: error.response?.data
    });
    throw error;
  }
};

export const disconnectInstagramAccount = async () => {
  try {
    const response = await api.post('/instagram/disconnect');
    console.log('Disconnect response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Disconnect Error:', error.response?.data);
    throw error;
  }
};

export const getBestPostingTimes = async () => {
  try {
    console.log('Fetching best posting times...');
    const response = await api.get('/posting/best-times');
    console.log('Best posting times response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Best Posting Times Error:', {
      message: error.response?.data?.message,
      details: error.response?.data?.details,
      error: error.response?.data
    });
    throw error;
  }
};

// Additional helper functions for data formatting
export const formatEngagementRate = (rate) => {
  return typeof rate === 'number' ? `${rate.toFixed(2)}%` : '0%';
};

export const formatFollowerCount = (count) => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export const getTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Error handling helper
export const handleInstagramError = (error) => {
  const defaultMessage = 'An error occurred while processing your request';
  
  if (!error.response) {
    return {
      message: error.message || defaultMessage,
      status: 500
    };
  }

  const { status, data } = error.response;
  
  const errorMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication failed. Please reconnect your Instagram account.',
    403: 'Access denied. Please check your permissions.',
    404: 'Resource not found.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.'
  };

  return {
    message: data?.message || errorMessages[status] || defaultMessage,
    status,
    details: data?.details || null
  };
};