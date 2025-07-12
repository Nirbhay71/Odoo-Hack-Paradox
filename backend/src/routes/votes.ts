import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Vote on question
router.post('/question/:id', authenticateToken, [
  body('value').isIn([1, -1])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: questionId } = req.params;
    const { value } = req.body;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is trying to vote on their own question
    if (question.authorId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot vote on your own question' });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_questionId: {
          userId: req.user!.id,
          questionId
        }
      }
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if same value
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });
        return res.json({ message: 'Vote removed', value: 0 });
      } else {
        // Update vote value
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value }
        });
        return res.json({ message: 'Vote updated', value });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          value,
          userId: req.user!.id,
          questionId
        }
      });
      return res.json({ message: 'Vote created', value });
    }
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote on answer
router.post('/answer/:id', authenticateToken, [
  body('value').isIn([1, -1])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: answerId } = req.params;
    const { value } = req.body;

    // Check if answer exists
    const answer = await prisma.answer.findUnique({
      where: { id: answerId }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is trying to vote on their own answer
    if (answer.authorId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot vote on your own answer' });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId: req.user!.id,
          answerId
        }
      }
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if same value
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });
        return res.json({ message: 'Vote removed', value: 0 });
      } else {
        // Update vote value
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value }
        });
        return res.json({ message: 'Vote updated', value });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          value,
          userId: req.user!.id,
          answerId
        }
      });
      return res.json({ message: 'Vote created', value });
    }
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;