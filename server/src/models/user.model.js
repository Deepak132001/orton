// server/src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  },
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
  }
}, {
  timestamps: true,
  versionKey: false // Disable the version key
});

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
