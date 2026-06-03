const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateUserStatus,
  deleteUser,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Admin user management routes
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserStatus);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
