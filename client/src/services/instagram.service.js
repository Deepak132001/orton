import api from './api';
import axios from 'axios'

// export const connectInstagramAccount = async (accessToken) => {
//   const response = await api.post('/instagram/connect', { accessToken });
//   return response.data;
// };
export const connectInstagramAccount = async (accessToken) => {
  try {
    console.log('Connecting with token:', accessToken);
    const response = await api.post('/instagram/connect', { accessToken });
    console.log('Connection response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Instagram connection error:', error.response?.data || error);
    throw error;
  }
};

// export const getInstagramProfile = async () => {
//   try {
//     const response = await api.get('/instagram/profile');
//     // Add username to the response
//     const profile = response.data;
//     return {
//       ...profile,
//       username: profile.username || 'No username' // Add this
//     };
//   } catch (error) {
//     throw error;
//   }
// };
export const getInstagramProfile = async () => {
  try {
    const response = await api.get('/instagram/profile');
    return response.data;
  } catch (error) {
    throw new Error('Instagram not connected');
  }
}  


// export const getInstagramInsights = async () => {
//   try {
//     const response = await api.get('/instagram/insights');
//     const profile = await getInstagramProfile(); // Get profile to include username
//     return {
//       ...response.data,
//       account: {
//         ...response.data.account,
//         username: profile.username // Add username to account object
//       }
//     };
//   } catch (error) {
//     throw error;
//   }
// };
export const getInstagramInsights = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      throw new Error('Instagram not connected');
    }

    // Get recent media data
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/media`,
      {
        params: {
          fields: 'id,caption,like_count,comments_count,timestamp,insights.metric(engagement,impressions,reach)',
          limit: 30,
          access_token: user.facebookAccessToken
        }
      }
    );

    // Get account info
    const accountResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}`,
      {
        params: {
          fields: 'followers_count,media_count,profile_picture_url',
          access_token: user.facebookAccessToken
        }
      }
    );

    return {
      account: {
        followers_count: accountResponse.data?.followers_count || 0,
        media_count: accountResponse.data?.media_count || 0,
        profile_picture_url: accountResponse.data?.profile_picture_url
      },
      recent_posts: (mediaResponse.data?.data || []).map(post => ({
        id: post.id,
        timestamp: post.timestamp,
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        caption: post.caption || '',
        reach: post.insights?.data?.[0]?.values?.[0]?.value || 0,
        impressions: post.insights?.data?.[1]?.values?.[0]?.value || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching Instagram insights:', error);
    throw error;
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