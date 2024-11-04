import { Router } from 'express';
import userRoutes from './user.routes';
import trackRoutes from './track.routes';
import eventRoutes from './event.routes';
import studioRoutes from './studio.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/users', userRoutes);
router.use('/tracks', trackRoutes);
router.use('/events', eventRoutes);
router.use('/studio', studioRoutes);
router.use('/transactions', transactionRoutes);

export default router;
