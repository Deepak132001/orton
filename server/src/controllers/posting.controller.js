// server/src/controllers/posting.controller.js

import { User } from '../models/user.model.js';
import axios from 'axios';



export const getBestPostingTimes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: 'Instagram account not connected'
      });
    }

    // Get recent posts for analysis
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/media`,
      {
        params: {
          fields: 'id,timestamp,like_count,comments_count,insights.metric(reach,impressions)',
          limit: 50, // Increased limit for better analysis
          access_token: user.facebookAccessToken
        }
      }
    );

    const posts = mediaResponse.data?.data || [];
    const totalPosts = posts.length;

    // Process hourly data
    const hourlyData = Array(24).fill(0).map((_, hour) => {
      const postsAtHour = posts.filter(post => {
        const postHour = new Date(post.timestamp).getHours();
        return postHour === hour;
      });

      const totalEngagement = postsAtHour.reduce((sum, post) => 
        sum + (post.like_count || 0) + (post.comments_count || 0), 0
      );

      return {
        hour,
        engagement: postsAtHour.length ? (totalEngagement / postsAtHour.length) : 0,
        postsCount: postsAtHour.length
      };
    });

    // Process daily data
    const dailyData = Array(7).fill(0).map((_, day) => {
      const postsOnDay = posts.filter(post => {
        const postDay = new Date(post.timestamp).getDay();
        return postDay === day;
      });

      const totalEngagement = postsOnDay.reduce((sum, post) => 
        sum + (post.like_count || 0) + (post.comments_count || 0), 0
      );

      return {
        day,
        engagement: postsOnDay.length ? (totalEngagement / postsOnDay.length) : 0,
        postsCount: postsOnDay.length
      };
    });

    // Find best times
    const bestHours = [...hourlyData]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
      .map(time => ({
        ...time,
        postsAnalyzed: time.postsCount
      }));

    const bestDays = [...dailyData]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
      .map(day => ({
        ...day,
        postsAnalyzed: day.postsCount
      }));

    res.json({
      hourlyBreakdown: hourlyData,
      dailyBreakdown: dailyData,
      bestHours,
      bestDays,
      totalPosts,
      analysisStartDate: posts[posts.length - 1]?.timestamp,
      analysisEndDate: posts[0]?.timestamp
    });
  } catch (error) {
    console.error('Error getting best posting times:', error);
    res.status(500).json({
      message: 'Failed to analyze posting times',
      error: error.message
    });
  }
};
