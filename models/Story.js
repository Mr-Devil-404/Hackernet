const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    img: {
        type: String
    },
    video: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400  // 24 hours = 86400 seconds
    }
});

module.exports = mongoose.model("Story", StorySchema);