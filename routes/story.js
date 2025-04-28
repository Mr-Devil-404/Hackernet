const router = require('express').Router();
const Story = require('../models/Story');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');

// Multer Setup for Story Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create Story
router.post('/', verifyToken, upload.fields([{ name: 'img' }, { name: 'video' }]), async (req, res) => {
    const newStory = new Story({
        userId: req.user.id,
        img: req.files['img'] ? req.files['img'][0].filename : null,
        video: req.files['video'] ? req.files['video'][0].filename : null
    });

    try {
        const savedStory = await newStory.save();
        res.status(200).json(savedStory);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Stories
router.get('/', verifyToken, async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 });
        res.status(200).json(stories);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;