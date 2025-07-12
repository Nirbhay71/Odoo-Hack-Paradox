import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create answer
router.post('/', authenticateToken, [
  body('content').trim().isLength({ min: 10 }),
  body('questionId').isString().notEmpty()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, questionId } = req.body;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: req.user!.id
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            reputation: true
          }
        }
      }
    });

    res.status(201).json(answer);
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update answer
router.put('/:id', authenticateToken, [
  body('content').trim().isLength({ min: 10 })
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;

    const answer = await prisma.answer.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            reputation: true
          }
        }
      }
    });

    res.json(updatedAnswer);
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept answer
router.patch('/:id/accept', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        question: {
          select: { authorId: true }
        }
      }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.question.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Only question author can accept answers' });
    }

    // Unaccept other answers for this question
    await prisma.answer.updateMany({
      where: {
        questionId: answer.questionId,
        isAccepted: true
      },
      data: {
        isAccepted: false
      }
    });

    // Accept this answer
    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { isAccepted: true },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            reputation: true
          }
        }
      }
    });

    res.json(updatedAnswer);
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete answer
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const answer = await prisma.answer.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.answer.delete({
      where: { id }
    });

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;