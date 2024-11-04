import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

interface CreateEventBody {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredGenres: string[];
  requiredMoods: string[];
  rewardAmount: number;
}

// Get all active events
router.get('/active', async (req, res, next) => {
  try {
    const now = new Date();
    const events = await prisma.gameEvent.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        status: 'ACTIVE'
      },
      include: {
        participations: {
          include: {
            user: true,
            track: true
          }
        }
      }
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Get specific event details
router.get('/:id', async (req, res, next) => {
  try {
    const event = await prisma.gameEvent.findUnique({
      where: { id: req.params.id },
      include: {
        participations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                level: true
              }
            },
            track: {
              select: {
                id: true,
                title: true,
                genre: true,
                mood: true,
                currentValue: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      throw new AppError(404, 'Event not found');
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Create new event
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      requiredGenres,
      requiredMoods,
      rewardAmount
    }: CreateEventBody = req.body;

    const event = await prisma.gameEvent.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        requiredGenres,
        requiredMoods,
        rewardAmount,
        status: 'UPCOMING'
      }
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

// Join an event with a track
router.post('/:id/join', async (req, res, next) => {
  try {
    const { userId, trackId } = req.body;

    // Verify event exists and is active
    const event = await prisma.gameEvent.findUnique({
      where: { id: req.params.id }
    });

    if (!event) {
      throw new AppError(404, 'Event not found');
    }

    if (event.status !== 'ACTIVE') {
      throw new AppError(400, 'Event is not active');
    }

    // Verify track meets event requirements
    const track = await prisma.track.findUnique({
      where: { id: trackId }
    });

    if (!track) {
      throw new AppError(404, 'Track not found');
    }

    const hasRequiredGenre = event.requiredGenres.some(genre => 
      track.genre.includes(genre)
    );

    const hasRequiredMood = event.requiredMoods.some(mood => 
      track.mood.includes(mood)
    );

    if (!hasRequiredGenre || !hasRequiredMood) {
      throw new AppError(400, 'Track does not meet event requirements');
    }

    // Create participation
    const participation = await prisma.eventParticipation.create({
      data: {
        userId,
        eventId: req.params.id,
        trackId
      },
      include: {
        user: true,
        track: true,
        event: true
      }
    });

    res.status(201).json(participation);
  } catch (error) {
    next(error);
  }
});

// Get event leaderboard
router.get('/:id/leaderboard', async (req, res, next) => {
  try {
    const participations = await prisma.eventParticipation.findMany({
      where: { eventId: req.params.id },
      orderBy: { score: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            level: true
          }
        },
        track: {
          select: {
            id: true,
            title: true,
            currentValue: true
          }
        }
      }
    });

    res.json(participations);
  } catch (error) {
    next(error);
  }
});

export default router;
