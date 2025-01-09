// server/src/services/notification.service.js
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';
import * as instagramService from './instagram.service.js';
import cron from 'node-cron';

// Create notification
export const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Check engagement changes
export const checkEngagementChanges = async (userId) => {
  try {
    const insights = await instagramService.getInstagramInsights(userId);
    if (!insights?.recent_posts?.length) return;

    const latestPost = insights.recent_posts[0];
    const previousPost = insights.recent_posts[1];

    if (latestPost && previousPost) {
      const currentEngagement = latestPost.likes + latestPost.comments;
      const previousEngagement = previousPost.likes + previousPost.comments;
      const changePercent = ((currentEngagement - previousEngagement) / previousEngagement) * 100;

      if (Math.abs(changePercent) >= 10) {
        await createNotification(
          userId,
          'ENGAGEMENT',
          'Engagement Update',
          `Your latest post has ${changePercent > 0 ? 'higher' : 'lower'} engagement than usual (${Math.abs(changePercent.toFixed(1))}% ${changePercent > 0 ? 'increase' : 'decrease'})`,
          {
            currentEngagement,
            previousEngagement,
            changePercent,
            postId: latestPost.id
          }
        );
      }
    }
  } catch (error) {
    console.error('Error checking engagement:', error);
  }
};

// Check best posting times
export const checkBestPostingTimes = async (userId) => {
  try {
    const bestTimes = await instagramService.getBestPostingTimes(userId);
    if (!bestTimes?.bestHours?.length) return;

    const bestHour = bestTimes.bestHours[0];
    const bestDay = bestTimes.bestDays[0];

    await createNotification(
      userId,
      'BEST_TIME',
      'Best Time to Post',
      `Based on your audience activity, consider posting on ${formatDay(bestDay.day)} at ${formatHour(bestHour.hour)}`,
      {
        bestDay: bestDay.day,
        bestHour: bestHour.hour,
        engagement: bestHour.engagement
      }
    );
  } catch (error) {
    console.error('Error checking best posting times:', error);
  }
};

// Initialize notification cron jobs
export const initializeNotificationJobs = () => {
  // Check engagement every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    try {
      const users = await User.find({ instagramBusinessId: { $exists: true } });
      for (const user of users) {
        await checkEngagementChanges(user._id);
      }
    } catch (error) {
      console.error('Error in engagement check cron:', error);
    }
  });

  // Check best posting times weekly
  cron.schedule('0 9 * * MON', async () => {
    try {
      const users = await User.find({ instagramBusinessId: { $exists: true } });
      for (const user of users) {
        await checkBestPostingTimes(user._id);
      }
    } catch (error) {
      console.error('Error in best times cron:', error);
    }
  });
};

// Helper functions
const formatDay = (day) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};

const formatHour = (hour) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${ampm}`;
};