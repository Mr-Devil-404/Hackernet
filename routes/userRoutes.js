const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user');
const verifyToken = require('../middleware/authMiddleware'); // Middleware Import করো

// Register API
router.post('/register', registerUser);

// Login API
router.post('/login', loginUser);

// Profile API (Protected Route)
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        msg: "Profile Accessed Successfully!",
        user: req.user, // Token থেকে পাওয়া ইউজার দেখাবে
    });
});

module.exports = router;
