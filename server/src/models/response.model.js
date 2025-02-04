// Backend: Response Model (src/models/response.model.js)
import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    enum: ['instagram', 'youtube'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export const Response = mongoose.model('Response', responseSchema);