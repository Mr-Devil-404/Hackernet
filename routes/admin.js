const router = require('express').Router();
const User = require('../models/User');
const Report = require('../models/Report');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all users (Admin Only)
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Ban a user (Admin Only)
router.put('/ban/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been banned and deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Verify a user (Admin Only)
router.put('/verify/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isVerified: true });
        res.status(200).json("User has been verified!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get reported users
router.get('/reports', verifyToken, async (req, res) => {
    try {
        const reports = await Report.find().populate('reporterId reportedUserId', 'username email');
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
