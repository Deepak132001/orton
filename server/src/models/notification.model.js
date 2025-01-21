// server/src/models/notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for better query performance
  },
  type: {
    type: String,
    enum: ['PERFORMANCE', 'BEST_TIME', 'ENGAGEMENT', 'MILESTONE', 'SYSTEM'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false,
    index: true // Add index for faster queries on read status
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting
  }
});

// Add compound index for common queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);