import { Client, GatewayIntentBits, ActivityType, EmbedBuilder } from 'discord.js';
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
    if (message.mentions.has(client.user)) {
      const embed = new EmbedBuilder()
        .setColor('#1DA1F2')
        .setTitle('XFixer')
        .addFields(
            { name: 'What is this?', value: 'XFixer is a bot that fixes Twitter/X embeds in Discord.' },
            { name: 'How does it work?', value: 'Just send a link to a Twitter/X post, and I will automatically reply with a fixed embed.' },
            { name: 'How can I add this bot?', value: 'Visit https://mikn.link/xfixer/' },
            { name: 'Disclaimer', value: 'This bot is not affiliated with Twitter/X Corp.' }
        )
        .setFooter({ text: 'XFixer by MikanDev' });
      message.reply({ embeds: [embed] });
    }
});

client.login(process.env.DISCORD_TOKEN);