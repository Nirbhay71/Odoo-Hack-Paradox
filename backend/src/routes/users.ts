import express from 'express';
import { prisma } from '../server';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        reputation: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            answers: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's questions
router.get('/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const questions = await prisma.question.findMany({
      where: { authorId: id },
      skip,
      take: Number(limit),
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            reputation: true
          }
        },
        _count: {
          select: {
            answers: true,
            votes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.question.count({ where: { authorId: id } });

    res.json({
      questions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user questions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's answers
router.get('/:id/answers', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const answers = await prisma.answer.findMany({
      where: { authorId: id },
      skip,
      take: Number(limit),
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            reputation: true
          }
        },
        question: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.answer.count({ where: { authorId: id } });

    res.json({
      answers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user answers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;