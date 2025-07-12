import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all questions
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (tag) {
      where.tags = {
        has: tag
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const questions = await prisma.question.findMany({
      where,
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
        },
        votes: req.user ? {
          where: {
            userId: req.user.id
          },
          select: {
            value: true
          }
        } : false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.question.count({ where });

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
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get question by ID
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    await prisma.question.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    });

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            reputation: true
          }
        },
        answers: {
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
                votes: true
              }
            },
            votes: req.user ? {
              where: {
                userId: req.user.id
              },
              select: {
                value: true
              }
            } : false
          },
          orderBy: [
            { isAccepted: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        _count: {
          select: {
            votes: true
          }
        },
        votes: req.user ? {
          where: {
            userId: req.user.id
          },
          select: {
            value: true
          }
        } : false
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create question
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('content').trim().isLength({ min: 10 }),
  body('tags').isArray().custom((tags: string[]) => {
    return tags.length <= 5 && tags.every(tag => typeof tag === 'string' && tag.length <= 20);
  })
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    const question = await prisma.question.create({
      data: {
        title,
        content,
        tags,
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

    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update question
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('content').optional().trim().isLength({ min: 10 }),
  body('tags').optional().isArray().custom((tags: string[]) => {
    return tags.length <= 5 && tags.every(tag => typeof tag === 'string' && tag.length <= 20);
  })
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, tags } = req.body;

    const question = await prisma.question.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (question.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(tags && { tags })
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

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete question
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (question.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.question.delete({
      where: { id }
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;