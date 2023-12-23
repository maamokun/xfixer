import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { config } from 'dotenv';
import { Handle } from './HandleLink.js';

config();

console.log("aaaaa");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });

client.on ('ready', () => {
    console.log (`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);
    client.user.setActivity('x.com | twitter.com', { type: ActivityType.Watching });
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('https://twitter.com/') || message.content.startsWith('https://x.com/')) {
      await Handle(message);
    }
  });

client.login(process.env.DISCORD_TOKEN);