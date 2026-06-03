const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
  testPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/test', protect, testPayment);
router.get('/key', protect, getRazorpayKey);

module.exports = router;
