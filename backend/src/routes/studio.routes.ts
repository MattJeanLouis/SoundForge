import { Router } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

const router = Router();

interface PurchaseStudioItemBody {
  userId: string;
  studioItemId: string;
}

// Get all available studio items
router.get('/items', async (req, res, next) => {
  try {
    const items = await prisma.studioItem.findMany({
      orderBy: {
        price: 'asc'
      }
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Get user's studio items
router.get('/user/:userId', async (req, res, next) => {
  try {
    const userStudio = await prisma.userStudioItem.findMany({
      where: {
        userId: req.params.userId
      },
      include: {
        studioItem: true
      }
    });

    // Calculate total bonus from all items
    const totalBonus = userStudio.reduce((acc: number, item) => 
      acc + item.studioItem.bonusMultiplier, 0);

    res.json({
      items: userStudio,
      totalBonus
    });
  } catch (error) {
    next(error);
  }
});

// Purchase a studio item
router.post('/purchase', async (req, res, next) => {
  try {
    const { userId, studioItemId }: PurchaseStudioItemBody = req.body;

    // Start a transaction to handle purchase
    const purchase = await prisma.$transaction(async (prisma) => {
      // Get the item and user
      const item = await prisma.studioItem.findUnique({
        where: { id: studioItemId }
      });

      if (!item) {
        throw new AppError(404, 'Studio item not found');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      // Check if user can afford the item
      if (user.infosargent < item.price) {
        throw new AppError(400, 'Insufficient infosargent');
      }

      // Check if user already owns this item
      const existingItem = await prisma.userStudioItem.findUnique({
        where: {
          userId_studioItemId: {
            userId,
            studioItemId
          }
        }
      });

      if (existingItem) {
        throw new AppError(400, 'You already own this item');
      }

      // Create the purchase and deduct infosargent
      const userStudioItem = await prisma.userStudioItem.create({
        data: {
          userId,
          studioItemId
        },
        include: {
          studioItem: true
        }
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          infosargent: {
            decrement: item.price
          }
        }
      });

      // Record the transaction
      await prisma.transaction.create({
        data: {
          type: 'PURCHASE',
          amount: -item.price,
          description: `Purchased studio item: ${item.name}`,
          userId
        }
      });

      return userStudioItem;
    });

    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
});

// Get studio item details
router.get('/items/:id', async (req, res, next) => {
  try {
    const item = await prisma.studioItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      throw new AppError(404, 'Studio item not found');
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

export default router;
