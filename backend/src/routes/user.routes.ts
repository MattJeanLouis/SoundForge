import { Router } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get user profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        tracks: true,
        studioItems: {
          include: {
            studioItem: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.patch('/:id', async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        username,
        email
      }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get user's game stats
router.get('/:id/stats', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        infosargent: true,
        level: true,
        experience: true,
        tracks: {
          select: {
            id: true,
            title: true,
            currentValue: true
          }
        },
        studioItems: {
          select: {
            studioItem: {
              select: {
                name: true,
                bonusMultiplier: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Calculate total studio bonus
    const totalBonus = user.studioItems.reduce((acc, item) => 
      acc + item.studioItem.bonusMultiplier, 0);

    // Calculate total portfolio value
    const portfolioValue = user.tracks.reduce((acc, track) => 
      acc + track.currentValue, 0);

    res.json({
      infosargent: user.infosargent,
      level: user.level,
      experience: user.experience,
      totalBonus,
      portfolioValue,
      trackCount: user.tracks.length,
      studioItemCount: user.studioItems.length
    });
  } catch (error) {
    next(error);
  }
});

// Get user's transaction history
router.get('/:id/transactions', async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 transactions
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

export default router;
