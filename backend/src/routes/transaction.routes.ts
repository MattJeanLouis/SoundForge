import { Router } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get user's transaction history with pagination
router.get('/user/:userId', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: req.params.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { userId: req.params.userId }
      })
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get transaction details
router.get('/:id', async (req, res, next) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

// Get user's transaction summary
router.get('/user/:userId/summary', async (req, res, next) => {
  try {
    const timeframe = req.query.timeframe as string || 'all';
    const now = new Date();
    let startDate: Date | undefined;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const whereClause = {
      userId: req.params.userId,
      ...(startDate && { createdAt: { gte: startDate } })
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause
    });

    // Calculate summary statistics
    const summary = transactions.reduce((acc, transaction) => {
      const type = transaction.type;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          total: 0
        };
      }
      acc[type].count += 1;
      acc[type].total += transaction.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    // Calculate total earnings and spending
    const totals = transactions.reduce((acc, transaction) => {
      if (transaction.amount > 0) {
        acc.earnings += transaction.amount;
      } else {
        acc.spending += Math.abs(transaction.amount);
      }
      return acc;
    }, { earnings: 0, spending: 0 });

    res.json({
      timeframe,
      summary,
      totals,
      transactionCount: transactions.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
