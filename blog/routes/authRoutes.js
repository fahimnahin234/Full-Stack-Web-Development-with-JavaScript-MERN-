const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
