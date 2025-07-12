const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    acceptedAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', questionSchema);