const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

// Create answer
router.post('/:questionId', protect, async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const answer = await Answer.create({
            content: req.body.content,
            author: req.user._id,
            question: question._id
        });

        question.answers.push(answer._id);
        await question.save();

        res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accept answer (question author only)
router.patch('/:answerId/accept', protect, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.answerId);
        const question = await Question.findById(answer.question);

        if (question.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        question.acceptedAnswer = answer._id;
        answer.isAccepted = true;
        
        await question.save();
        await answer.save();

        res.json(answer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;