const router = require('express').Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Get User Profile
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update User Profile (Profile Pic, Cover Pic, Bio)
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can update only your own profile!");
    }
});

// Follow a user
router.put('/:id/follow', verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);
            if (!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User has been followed!");
            } else {
                res.status(400).json("You already follow this user!");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't follow yourself!");
    }
});

// Unfollow a user
router.put('/:id/unfollow', verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);
            if (user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User has been unfollowed!");
            } else {
                res.status(400).json("You don't follow this user!");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't unfollow yourself!");
    }
});

module.exports = router;