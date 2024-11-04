import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('Discord bot is online!');
});

client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }
});

export const startDiscordBot = () => {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    throw new Error('Discord bot token must be set in environment variables.');
  }
  client.login(token);
};
