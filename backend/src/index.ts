import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { setupDiscordBot } from './services/discord';

// Initialize environment variables
dotenv.config();

// Create Express application
const app = express();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`🎮 SoundForge server running on port ${PORT}`);
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('📦 Connected to database successfully');

    // Initialize Discord bot if token is provided
    if (process.env.DISCORD_BOT_TOKEN) {
      await setupDiscordBot();
      console.log('🤖 Discord bot initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
