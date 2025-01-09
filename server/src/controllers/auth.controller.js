// server/src/controllers/auth.controller.js

import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
// import { createTestNotifications } from '../services/notification.service.js';

export const register = async (req, res, next) => {
  try {
    console.log('Registration request received:', {
      email: req.body.email,
      hasPassword: !!req.body.password
    });

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    // Create test notifications for new user
    // try {
    //   await createTestNotifications(user._id);
    // } catch (notificationError) {
    //   console.error('Error creating test notifications:', notificationError);
    //   // Continue with registration even if notifications fail
    // }


    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user and handle case sensitivity
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    // Create test notifications after successful login
    // try {
    //   await createTestNotifications(user._id);
    // } catch (notificationError) {
    //   console.error('Error creating test notifications:', notificationError);
    //   // Continue with login even if notifications fail
    // }


    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};
