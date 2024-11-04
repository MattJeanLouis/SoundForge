import { Client, Events, GatewayIntentBits } from 'discord.js';
import { prisma } from '../index';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

export const setupDiscordBot = async () => {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`🎮 Discord bot ready! Logged in as ${readyClient.user.tag}`);
  });

  // Handle contract creation messages
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Check if message is in contracts channel
    if (message.channel.name === 'contracts') {
      try {
        // Parse contract details from message
        // Format: !contract [genre] [reward] [description]
        if (message.content.startsWith('!contract')) {
          const parts = message.content.split(' ');
          if (parts.length >= 4) {
            const genre = parts[1];
            const reward = parseFloat(parts[2]);
            const description = parts.slice(3).join(' ');

            // Store contract in database
            // Implementation will be added later
            
            await message.reply(`✅ Contract created!\nGenre: ${genre}\nReward: ${reward} infosargent\nDescription: ${description}`);
          }
        }
      } catch (error) {
        console.error('Error handling contract message:', error);
        await message.reply('❌ Error creating contract. Please try again.');
      }
    }
  });

  // Handle collaboration requests
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Check if message is in collaborations channel
    if (message.channel.name === 'collaborations') {
      try {
        // Parse collaboration request
        // Format: !collab [genre] [description]
        if (message.content.startsWith('!collab')) {
          const parts = message.content.split(' ');
          if (parts.length >= 3) {
            const genre = parts[1];
            const description = parts.slice(2).join(' ');

            // Store collaboration request in database
            // Implementation will be added later

            await message.reply(`🤝 Collaboration request posted!\nGenre: ${genre}\nDescription: ${description}`);
          }
        }
      } catch (error) {
        console.error('Error handling collaboration request:', error);
        await message.reply('❌ Error posting collaboration request. Please try again.');
      }
    }
  });

  // Login bot with token
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
  }
  
  await client.login(token);
};

// Export bot instance for use in other parts of the application
export const getDiscordClient = () => client;
