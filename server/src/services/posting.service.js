

import axios from 'axios';

export const analyzeBestPostingTimes = async (instagramBusinessId, accessToken) => {
  try {
    // Get account info first
    const accountResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${instagramBusinessId}`,
      {
        params: {
          fields: 'followers_count,media_count',
          access_token: accessToken
        }
      }
    );

    const followerCount = accountResponse.data.followers_count;
    const mediaCount = accountResponse.data.media_count;

    // For accounts with limited data, return simplified analysis
    if (followerCount < 100 || mediaCount < 5) {
      return {
        hourlyBreakdown: generateDefaultHourlyData(),
        dailyBreakdown: generateDefaultDailyData(),
        bestHours: [
          { hour: 9, engagement: 2.5, postsCount: 0 },
          { hour: 12, engagement: 2.0, postsCount: 0 },
          { hour: 17, engagement: 2.2, postsCount: 0 }
        ],
        bestDays: [
          { day: 1, engagement: 2.5, postsCount: 0 }, // Monday
          { day: 3, engagement: 2.3, postsCount: 0 }, // Wednesday
          { day: 5, engagement: 2.1, postsCount: 0 }  // Friday
        ],
        peakActivityTimes: [
          { day: 1, hour: 9, count: 0 },
          { day: 3, hour: 12, count: 0 },
          { day: 5, hour: 17, count: 0 }
        ],
        timeDistribution: Array(7).fill(Array(24).fill(0)),
        totalPosts: mediaCount,
        averageEngagement: 2.0,
        analysisStartDate: new Date().toISOString(),
        analysisEndDate: new Date().toISOString(),
        isLimitedData: true,
        recommendedTimes: [
          "Monday 9:00 AM",
          "Wednesday 12:00 PM",
          "Friday 5:00 PM"
        ]
      };
    }

    // Get recent media with insights
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${instagramBusinessId}/media`,
      {
        params: {
          fields: 'id,timestamp,like_count,comments_count,insights.metric(engagement,impressions,reach)',
          limit: 50,
          access_token: accessToken
        }
      }
    );

    // Process the data as before...
    const posts = mediaResponse.data?.data || [];
    // ... rest of your existing analysis code
  } catch (error) {
    console.error('Error analyzing posting times:', error);
    throw error;
  }
};

const generateDefaultHourlyData = () => {
  return Array(24).fill(0).map((_, hour) => ({
    hour,
    engagement: 2.0,
    postsCount: 0
  }));
};

const generateDefaultDailyData = () => {
  return Array(7).fill(0).map((_, day) => ({
    day,
    engagement: 2.0,
    postsCount: 0
  }));
};