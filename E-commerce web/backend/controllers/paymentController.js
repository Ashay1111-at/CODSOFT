const razorpay = require('../utils/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentInfo: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        orderStatus: 'Processing',
      });
    }

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRazorpayKey = async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

const testPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentInfo: {
          razorpayOrderId: 'test_order',
          razorpayPaymentId: 'test_payment',
          razorpaySignature: 'test_signature',
        },
        orderStatus: 'Processing',
      });
    }
    res.json({ success: true, message: 'Test payment processed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment, getRazorpayKey, testPayment };
