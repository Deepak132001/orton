// server/src/services/cron.service.js
import cron from 'node-cron';
import { User } from '../models/user.model.js';
import * as notificationService from './notification.service.js';
import * as instagramService from './instagram.service.js';

const initializeCronJobs = () => {
  // Daily performance notifications at 9 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('Running daily performance notifications cron job');
      const users = await User.find({ instagramBusinessId: { $exists: true } });
      
      for (const user of users) {
        try {
          await notificationService.generateDailyPerformanceNotification(user._id);
        } catch (error) {
          console.error(`Failed to generate notification for user ${user._id}:`, error);
          // Continue with next user even if one fails
        }
      }
      
      console.log('Daily performance notifications completed');
    } catch (error) {
      console.error('Failed to run daily notifications cron job:', error);
    }
  }, {
    timezone: "UTC"
  });

  // Weekly best time notifications on Monday at 10 AM
  cron.schedule('0 10 * * 1', async () => {
    try {
      console.log('Running weekly best time notifications cron job');
      const users = await User.find({ instagramBusinessId: { $exists: true } });
      
      for (const user of users) {
        try {
          await notificationService.generateBestTimeNotification(user._id);
        } catch (error) {
          console.error(`Failed to generate best time notification for user ${user._id}:`, error);
          // Continue with next user even if one fails
        }
      }
      
      console.log('Weekly best time notifications completed');
    } catch (error) {
      console.error('Failed to run weekly best time notifications cron job:', error);
    }
  }, {
    timezone: "UTC"
  });

  // Daily engagement analysis at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running daily engagement analysis cron job');
      const users = await User.find({ instagramBusinessId: { $exists: true } });
      
      for (const user of users) {
        try {
          const insights = await instagramService.getInstagramInsights(user._id);
          const recentEngagement = calculateRecentEngagement(insights);
          
          if (recentEngagement.significantChange) {
            await notificationService.createNotification(
              user._id,
              'ENGAGEMENT',
              'Engagement Update',
              `Your engagement ${recentEngagement.direction} by ${recentEngagement.percentage}% in the last 24 hours.`,
              recentEngagement
            );
          }
        } catch (error) {
          console.error(`Failed to analyze engagement for user ${user._id}:`, error);
        }
      }
      
      console.log('Daily engagement analysis completed');
    } catch (error) {
      console.error('Failed to run engagement analysis cron job:', error);
    }
  }, {
    timezone: "UTC"
  });

  // Weekly analytics summary on Sunday at 6 PM
  cron.schedule('0 18 * * 0', async () => {
    try {
      console.log('Running weekly analytics summary cron job');
      const users = await User.find({ instagramBusinessId: { $exists: true } });
      
      for (const user of users) {
        try {
          const weeklyStats = await generateWeeklySummary(user._id);
          await notificationService.createNotification(
            user._id,
            'ANALYTICS',
            'Weekly Performance Summary',
            createWeeklySummaryMessage(weeklyStats),
            weeklyStats
          );
        } catch (error) {
          console.error(`Failed to generate weekly summary for user ${user._id}:`, error);
        }
      }
      
      console.log('Weekly analytics summary completed');
    } catch (error) {
      console.error('Failed to run weekly summary cron job:', error);
    }
  }, {
    timezone: "UTC"
  });
};

// Helper functions
const calculateRecentEngagement = (insights) => {
  const recentPosts = insights.recent_posts || [];
  const last24Hours = recentPosts.filter(post => 
    new Date(post.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  const previous24Hours = recentPosts.filter(post => {
    const postDate = new Date(post.timestamp);
    return postDate <= new Date(Date.now() - 24 * 60 * 60 * 1000) &&
           postDate > new Date(Date.now() - 48 * 60 * 60 * 1000);
  });

  const calculateEngagement = (posts) => {
    if (posts.length === 0) return 0;
    return posts.reduce((sum, post) => sum + (post.likes || 0) + (post.comments || 0), 0) / posts.length;
  };

  const currentEngagement = calculateEngagement(last24Hours);
  const previousEngagement = calculateEngagement(previous24Hours);

  if (previousEngagement === 0) return { significantChange: false };

  const percentageChange = ((currentEngagement - previousEngagement) / previousEngagement) * 100;

  return {
    significantChange: Math.abs(percentageChange) > 10,
    direction: percentageChange > 0 ? 'increased' : 'decreased',
    percentage: Math.abs(percentageChange).toFixed(1),
    currentEngagement,
    previousEngagement
  };
};

const generateWeeklySummary = async (userId) => {
  const insights = await instagramService.getInstagramInsights(userId);
  const recentPosts = insights.recent_posts || [];
  
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekPosts = recentPosts.filter(post => new Date(post.timestamp) > weekAgo);
  
  const totalLikes = weekPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = weekPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const totalReach = weekPosts.reduce((sum, post) => sum + (post.reach || 0), 0);
  
  const bestPost = [...weekPosts].sort((a, b) => 
    (b.likes + b.comments) - (a.likes + a.comments)
  )[0];

  return {
    totalPosts: weekPosts.length,
    totalLikes,
    totalComments,
    averageEngagement: weekPosts.length ? 
      ((totalLikes + totalComments) / weekPosts.length).toFixed(1) : 0,
    totalReach,
    bestPost: bestPost ? {
      timestamp: bestPost.timestamp,
      likes: bestPost.likes,
      comments: bestPost.comments,
      reach: bestPost.reach
    } : null
  };
};

const createWeeklySummaryMessage = (stats) => {
  return `This week: ${stats.totalPosts} posts, ${stats.totalLikes} likes, ${stats.totalComments} comments. Average engagement: ${stats.averageEngagement} per post.`;
};

export default initializeCronJobs;