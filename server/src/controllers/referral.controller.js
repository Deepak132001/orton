// server/src/controllers/referral.controller.js
import { User } from '../models/user.model.js';

export const getReferralStats = async (req, res) => {
  try {
    // console.log('Getting referral stats');
    // console.log('User from request:', req.user);

    if (!req.user || !req.user.id) {
      // console.log('No user in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user.id);
    // console.log('Found user:', user ? user._id : 'none');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      referralCode: user.referralCode || '',
      earnings: user.referralEarnings || 0,
      referralCount: user.referralCount || 0,
      pendingPayout: user.pendingPayout || 0,
      totalPaidOut: user.totalPaidOut || 0,
      payoutHistory: user.payoutHistory || [],
      paypalEmail: user.paypalEmail || ''
    };

    // console.log('Returning stats:', stats);
    res.json(stats);
  } catch (error) {
    // console.error('Error in getReferralStats:', error);
    res.status(500).json({ 
      message: 'Error fetching referral stats',
      error: error.message 
    });
  }
};

export const requestPayout = async (req, res) => {
  try {
    const { amount, paypalEmail } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // Calculate available balance properly
    const totalEarnings = user.referralEarnings || 0;
    const totalPaidOut = user.totalPaidOut || 0;
    const pendingPayout = user.pendingPayout || 0;
    const availableBalance = totalEarnings - totalPaidOut - pendingPayout;

    console.log('Payout Request Debug:', {
      totalEarnings,
      totalPaidOut,
      pendingPayout,
      availableBalance,
      requestedAmount: amount
    });

    // Validate minimum amount
    if (amount < 10) {
      return res.status(400).json({
        message: 'Minimum payout amount is $10'
      });
    }

    // Validate available balance
    if (amount > availableBalance) {
      return res.status(400).json({
        message: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`
      });
    }

    // Update PayPal email if provided
    if (paypalEmail) {
      user.paypalEmail = paypalEmail;
    }

    // Add payout request to history
    user.payoutHistory.push({
      amount,
      paymentMethod: 'paypal',
      status: 'pending',
      requestDate: new Date()
    });

    // Update pending payout
    user.pendingPayout += amount;

    await user.save();

    res.status(200).json({
      message: 'Payout request submitted successfully',
      pendingPayout: user.pendingPayout,
      availableBalance: availableBalance - amount
    });
  } catch (error) {
    console.error('Payout request error:', error);
    res.status(500).json({
      message: 'Error processing payout request'
    });
  }
};

export const validateReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const referrer = await User.findOne({ referralCode });
    
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }
    
    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ message: 'Error validating referral code' });
  }
};

export const getPayoutRequests = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get all users with pending payouts
    const users = await User.find({
      'payoutHistory.status': 'pending'
    }).select('email paypalEmail payoutHistory referralEarnings');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payout requests' });
  }
};

// In referral.controller.js
export const updatePayoutStatus = async (req, res) => {
  try {
    const { userId, payoutId, status } = req.body;

    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(userId);
    const payout = user.payoutHistory.id(payoutId);

    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    // Only process if status is changing
    if (payout.status !== status) {
      if (status === 'processed') {
        // Ensure we don't create negative values
        if (payout.amount > user.referralEarnings - user.totalPaidOut) {
          return res.status(400).json({ 
            message: 'Cannot process payout: amount exceeds available earnings' 
          });
        }
        
        user.pendingPayout = Math.max(0, user.pendingPayout - payout.amount);
        user.totalPaidOut += payout.amount;
      } else if (status === 'failed') {
        user.pendingPayout = Math.max(0, user.pendingPayout - payout.amount);
      }

      payout.status = status;
      payout.processedDate = new Date();
    }

    await user.save();

    res.json({ message: 'Payout status updated' });
  } catch (error) {
    console.error('Error updating payout status:', error);
    res.status(500).json({ message: 'Error updating payout status' });
  }
};