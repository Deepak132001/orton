// server/src/controllers/notification.controller.js
import { Notification } from '../models/notification.model.js';
import * as instagramService from '../services/instagram.service.js';

// Get notifications
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    // Instead of updating, we'll delete the notification
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    // Delete all notifications for the user
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    next(error);
  }
};