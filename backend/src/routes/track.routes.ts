import { Router } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get all tracks for a user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany({
      where: { userId: req.params.userId },
      include: {
        boosts: true,
        eventParticipations: {
          include: {
            event: true
          }
        }
      }
    });

    res.json(tracks);
  } catch (error) {
    next(error);
  }
});

// Get a specific track
router.get('/:id', async (req, res, next) => {
  try {
    const track = await prisma.track.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        boosts: {
          include: {
            sender: true,
            receiver: true
          }
        },
        eventParticipations: {
          include: {
            event: true
          }
        }
      }
    });

    if (!track) {
      throw new AppError(404, 'Track not found');
    }

    res.json(track);
  } catch (error) {
    next(error);
  }
});

// Update track details
router.patch('/:id', async (req, res, next) => {
  try {
    const { genre, mood } = req.body;

    const track = await prisma.track.update({
      where: { id: req.params.id },
      data: {
        genre: genre as string[],
        mood: mood as string[]
      }
    });

    res.json(track);
  } catch (error) {
    next(error);
  }
});

// Create a boost for a track
router.post('/:id/boost', async (req, res, next) => {
  try {
    const { senderId, amount, duration } = req.body;

    // Calculate boost end time
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + duration);

    // Start a transaction to handle boost creation and infosargent deduction
    const boost = await prisma.$transaction(async (tx) => {
      // Get the track to find the receiver
      const track = await tx.track.findUnique({
        where: { id: req.params.id },
        select: { userId: true }
      });

      if (!track) {
        throw new AppError(404, 'Track not found');
      }

      // Deduct infosargent from sender
      await tx.user.update({
        where: { id: senderId },
        data: {
          infosargent: {
            decrement: amount
          }
        }
      });

      // Create the boost
      const boost = await tx.boost.create({
        data: {
          amount,
          duration,
          endTime,
          senderId,
          receiverId: track.userId,
          trackId: req.params.id
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          type: 'BOOST',
          amount: -amount,
          description: `Boost sent for track ${req.params.id}`,
          userId: senderId
        }
      });

      return boost;
    });

    res.json(boost);
  } catch (error) {
    next(error);
  }
});

// Get track value history (for charts/graphs)
router.get('/:id/value-history', async (req, res, next) => {
  try {
    // This would typically query a separate table tracking historical values
    // For now, we'll return a simplified response
    const track = await prisma.track.findUnique({
      where: { id: req.params.id },
      select: {
        baseValue: true,
        currentValue: true,
        boosts: {
          select: {
            amount: true,
            createdAt: true
          }
        }
      }
    });

    if (!track) {
      throw new AppError(404, 'Track not found');
    }

    res.json({
      currentValue: track.currentValue,
      baseValue: track.baseValue,
      boostHistory: track.boosts
    });
  } catch (error) {
    next(error);
  }
});

export default router;
