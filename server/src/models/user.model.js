// server/src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

// Create the schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },// Referral System Fields
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  referralCount: {
    type: Number,
    default: 0
  },
  paypalEmail: {
    type: String,
    sparse: true,
    trim: true
  },
  pendingPayout: {
    type: Number,
    default: 0
  },
  payoutHistory: [{
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['paypal'],
      default: 'paypal'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    processedDate: Date
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Your existing fields,
  instagramBusinessId: {
    type: String,
    sparse: true,
    default: null
  },
  facebookAccessToken: {
    type: String,
    default: null
  },
  facebookPageId: {
    type: String,
    default: null
  },
  totalPaidOut: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false // Disable the version key
});

// Generate unique referral code
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.referralCode) {
    const generateCode = () => {
      return randomBytes(4).toString('hex').toUpperCase();
    };
    
    let code = generateCode();
    let isUnique = false;
    
    while (!isUnique) {
      const existingUser = await this.constructor.findOne({ referralCode: code });
      if (!existingUser) {
        isUnique = true;
      } else {
        code = generateCode();
      }
    }
    
    this.referralCode = code;
  }
  next();
});

// Method to process referral reward
userSchema.methods.processReferralReward = async function() {
  // console.log('Processing reward for user:', this._id);
  // console.log('Current earnings:', this.referralEarnings);
  // console.log('Current referral count:', this.referralCount);
  
  this.referralEarnings = (this.referralEarnings || 0) + 2;
  this.referralCount = (this.referralCount || 0) + 1;
  
  // console.log('New earnings:', this.referralEarnings);
  // console.log('New referral count:', this.referralCount);
  
  const savedUser = await this.save();
  // console.log('Saved user data:', {
  //   earnings: savedUser.referralEarnings,
  //   count: savedUser.referralCount
  // });
  
  return savedUser;
};;

// Remove old indexes
userSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const indexes = await this.collection.getIndexes();
      if (indexes.username_1) {
        await this.collection.dropIndex('username_1');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create the model
const User = mongoose.model('User', userSchema);

// Drop the old indexes if they exist
const dropOldIndexes = async () => {
  try {
    const indexes = await User.collection.getIndexes();
    if (indexes.username_1) {
      await User.collection.dropIndex('username_1');
      console.log('Dropped username index');
    }
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }
};

// Run the index cleanup
dropOldIndexes();

export { User };
