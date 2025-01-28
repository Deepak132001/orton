// In client/src/services/instagram.service.js, add:
import axios from 'axios';
import { User } from '../models/user.model.js';

// export const getBestPostingTimes = async () => {
//     const response = await api.get('/posting/best-times');
//     return response.data;
//   };

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