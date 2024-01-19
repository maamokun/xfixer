import { Client, GatewayIntentBits, ActivityType, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
import { Handle } from './HandleLink.js';
import { Translate } from '@google-cloud/translate/build/src/v2';

config();

console.log("aaaaa");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
const translate = new Translate({ projectId: process.env.PROJECT_ID, key: process.env.GOOGLE_KEY });

client.on ('ready', () => {
    console.log (`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);
    client.user.setActivity('x.com | twitter.com', { type: ActivityType.Watching });
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('https://twitter.com/') || message.content.startsWith('https://x.com/')) {
      await Handle(message);
    }
    if (message.mentions.has(client.user) && message.content.includes(`<@${client.user.id}>`)) {
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

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) 
    return;
  if (interaction.customId === 'delete') {
    await interaction.message.delete();
  }
  if (interaction.customId === 'translate') {
    let embed = interaction.message.embeds[0];
    const text = embed.description;
    const [translated] = await translate.translate(text, 'en');

    console.log(translated);

    const newEmbed = new EmbedBuilder()
      .setColor('#1DA1F2')
      .setTitle(embed.title)
      .setURL(embed.url)
      .setThumbnail(embed.thumbnail.url)
      .setAuthor({ name: `Original Post by ${embed.author.name} Translated to English` })
      .setDescription(`${translated}`)
      .setImage(embed.image.url)
      .setFooter({ text: `Powered by Google Translate` });

    await interaction.reply({ embeds: [newEmbed], ephemeral: true });
  }
}
);


client.login(process.env.DISCORD_TOKEN);