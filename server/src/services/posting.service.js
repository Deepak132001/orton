// // server/src/services/posting.service.js

// import axios from 'axios';

// export const analyzeBestPostingTimes = async (instagramBusinessId, accessToken) => {
//   try {
//     // Get recent media with insights
//     const mediaResponse = await axios.get(
//       `https://graph.facebook.com/v18.0/${instagramBusinessId}/media`,
//       {
//         params: {
//           fields: 'id,timestamp,like_count,comments_count,insights.metric(engagement,impressions,reach)',
//           limit: 50, // Get more posts for better analysis
//           access_token: accessToken
//         }
//       }
//     );

//     const posts = mediaResponse.data?.data || [];

//     // Initialize data structures for analysis
//     const hourlyEngagement = Array(24).fill(0).map(() => ({
//       total: 0,
//       count: 0,
//       engagement: 0
//     }));

//     const dailyEngagement = Array(7).fill(0).map(() => ({
//       total: 0,
//       count: 0,
//       engagement: 0
//     }));

//     // Process each post
//     posts.forEach(post => {
//       if (!post.timestamp) return;

//       const date = new Date(post.timestamp);
//       const hour = date.getHours();
//       const day = date.getDay();
      
//       // Calculate engagement for this post
//       const engagement = (post.like_count || 0) + (post.comments_count || 0);
//       const reach = post.insights?.data?.find(d => d.name === 'reach')?.values[0]?.value || 1;
//       const engagementRate = (engagement / reach) * 100;

//       // Update hourly stats
//       hourlyEngagement[hour].total += engagementRate;
//       hourlyEngagement[hour].count += 1;

//       // Update daily stats
//       dailyEngagement[day].total += engagementRate;
//       dailyEngagement[day].count += 1;
//     });

//     // Calculate averages and prepare the response
//     const processedHourly = hourlyEngagement.map((hour, index) => ({
//       hour: index,
//       engagement: hour.count > 0 ? hour.total / hour.count : 0,
//       postsCount: hour.count
//     }));

//     const processedDaily = dailyEngagement.map((day, index) => ({
//       day: index,
//       engagement: day.count > 0 ? day.total / day.count : 0,
//       postsCount: day.count
//     }));

//     // Find top performing times
//     const sortedHourly = [...processedHourly]
//       .sort((a, b) => b.engagement - a.engagement)
//       .slice(0, 3);

//     const sortedDaily = [...processedDaily]
//       .sort((a, b) => b.engagement - a.engagement)
//       .slice(0, 3);

//     // Get time distribution for each day
//     const timeDistribution = Array(7).fill(0).map(() => Array(24).fill(0));
//     posts.forEach(post => {
//       if (!post.timestamp) return;
//       const date = new Date(post.timestamp);
//       const hour = date.getHours();
//       const day = date.getDay();
//       timeDistribution[day][hour]++;
//     });

//     // Calculate peak activity times
//     const peakActivityTimes = [];
//     timeDistribution.forEach((hours, day) => {
//       const maxPosts = Math.max(...hours);
//       if (maxPosts > 0) {
//         hours.forEach((count, hour) => {
//           if (count === maxPosts) {
//             peakActivityTimes.push({
//               day,
//               hour,
//               count
//             });
//           }
//         });
//       }
//     });

//     return {
//       hourlyBreakdown: processedHourly,
//       dailyBreakdown: processedDaily,
//       bestHours: sortedHourly,
//       bestDays: sortedDaily,
//       peakActivityTimes: peakActivityTimes.sort((a, b) => b.count - a.count).slice(0, 5),
//       timeDistribution,
//       totalPosts: posts.length,
//       averageEngagement: processedHourly.reduce((sum, hour) => sum + hour.engagement, 0) / 24,
//       analysisStartDate: posts[posts.length - 1]?.timestamp,
//       analysisEndDate: posts[0]?.timestamp
//     };

//   } catch (error) {
//     console.error('Error analyzing posting times:', error);
//     throw error;
//   }
// };

// server/src/services/posting.service.js

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