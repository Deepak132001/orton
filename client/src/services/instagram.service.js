import api from './api';

export const connectInstagramAccount = async (accessToken) => {
  try {
    // console.log('Connecting with token:', accessToken);
    const response = await api.post('/instagram/connect', { accessToken });
    // console.log('Connection response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Instagram connection error:', error.response?.data || error);
    throw error;
  }
};

export const getInstagramProfile = async () => {
  try {
    const response = await api.get('/instagram/profile');
    return response.data;
  } catch (error) {
    throw new Error('Instagram not connected');
  }
}  

export const getInstagramInsights = async () => {
  try {
    const response = await api.get('/instagram/insights');
    const profile = await getInstagramProfile();
    return {
      ...response.data,
      account: {
        ...response.data.account,
        username: profile.username
      }
    };
  } catch (error) {
    throw new Error('Instagram not connected');
  }
};

export const disconnectInstagramAccount = async () => {
  const response = await api.post('/instagram/disconnect');
  return response.data;
};

export const getBestPostingTimes = async () => {
  const response = await api.get('/posting/best-times');
  return response.data;
};


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
