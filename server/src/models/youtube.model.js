// // src/models/youtube.model.js
// import mongoose from 'mongoose';

// const youtubeSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   channelId: {
//     type: String,
//     required: true
//   },
//   accessToken: {
//     type: String,
//     required: true
//   },
//   refreshToken: {
//     type: String,
//     required: true
//   },
//   tokenExpiry: {
//     type: Date,
//     required: true
//   },
//   trialStartDate: {
//     type: Date,
//     default: Date.now
//   },
//   isSubscribed: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true });

// const transcriptionSchema = new mongoose.Schema({
//   videoId: {
//     type: String,
//     required: true,
//     index: true
//   },
//   channelId: {
//     type: String,
//     required: true,
//     index: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   source: {
//     type: String,
//     enum: ['public_captions', 'whisper'],
//     required: true
//   },
//   transcriptionText: {
//     type: String,
//     required: true
//   },
//   language: {
//     type: String,
//     default: 'en'
//   },
//   metadata: {
//     type: Map,
//     of: String,
//     default: {}
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'completed', 'failed'],
//     default: 'pending'
//   },
//   error: {
//     type: String
//   }
// }, {
//   timestamps: true
// });

// // Add indexes for common queries
// transcriptionSchema.index({ videoId: 1, userId: 1 }, { unique: true });
// transcriptionSchema.index({ channelId: 1, createdAt: -1 });

// export const YouTube = mongoose.model('YouTube', youtubeSchema);
// export const Transcription = mongoose.model('Transcription', transcriptionSchema);

// src/models/youtube.model.js
import mongoose from 'mongoose';

const youtubeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  channelId: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  tokenExpiry: {
    type: Date,
    required: true
  },
  trialStartDate: {
    type: Date,
    default: Date.now
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  lastAnalyticsUpdate: {
    type: Date,
    default: null
  },
  subscriberCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  videoCount: {
    type: Number,
    default: 0
  },
  weeklyStats: {
    type: Map,
    of: Number,
    default: {}
  }
}, { 
  timestamps: true 
});

const transcriptionSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    index: true
  },
  channelId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  source: {
    type: String,
    enum: ['public_captions', 'whisper'],
    required: true
  },
  transcriptionText: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for common queries
transcriptionSchema.index({ videoId: 1, userId: 1 }, { unique: true });
transcriptionSchema.index({ channelId: 1, createdAt: -1 });

export const YouTube = mongoose.model('YouTube', youtubeSchema);
export const Transcription = mongoose.model('Transcription', transcriptionSchema);