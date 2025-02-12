// server/src/routes/referral.routes.js
import express from 'express';
import { getPayoutRequests, getReferralStats, requestPayout, updatePayoutStatus, validateReferralCode } from '../controllers/referral.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', authenticate, getReferralStats);
router.post('/validate', validateReferralCode);
router.post('/payout', authenticate, requestPayout);
router.get('/admin/payouts', authenticate, getPayoutRequests);
router.post('/admin/payout-status', authenticate, updatePayoutStatus);

export default router;