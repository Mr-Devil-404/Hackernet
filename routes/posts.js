const router = require('express').Router();
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');

// Multer Setup for Post Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create Post
router.post('/', verifyToken, upload.fields([{ name: 'img' }, { name: 'video' }]), async (req, res) => {
    const newPost = new Post({
        userId: req.user.id,
        desc: req.body.desc,
        img: req.files['img'] ? req.files['img'][0].filename : null,
        video: req.files['video'] ? req.files['video'][0].filename : null
    });

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Posts
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Like/Unlike Post
router.put('/:id/like', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json("Post liked!");
        } else {
            await post.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json("Post unliked!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;