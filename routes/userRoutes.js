const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user');
const { protect } = require('../middleware/authMiddleware'); // ঠিকমতো import করো

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: "Profile Accessed Successfully!",
    user: req.user,
  });
});

module.exports = router;
