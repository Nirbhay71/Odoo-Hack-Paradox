const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect, allowGuest } = require('../middleware/auth');

// Get all questions (accessible by all)
router.get('/', allowGuest, async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create question (authenticated users only)
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const question = await Question.create({
            title,
            description,
            tags,
            author: req.user._id
        });
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get question by ID (accessible by all)
router.get('/:id', allowGuest, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'answers',
                populate: { path: 'author', select: 'username' }
            });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;