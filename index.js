import { Client, GatewayIntentBits, ActivityType, EmbedBuilder, AttachmentBuilder, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { deploy } from './deploy_commands.js';
import { config } from 'dotenv';
import { Handle } from './HandleLink.js';
import { HandleTranslate } from './HandleTranslate.js';
import { openSettings } from './slashHandler.js';
import { setMode } from './dbManager.js';
import { Translate } from '@google-cloud/translate/build/src/v2';

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
const translate = new Translate({ projectId: process.env.PROJECT_ID, key: process.env.GOOGLE_KEY });

client.on ('ready', () => {
    deploy(client.user.id);
    console.log (`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);
    client.user.setActivity('x.com | twitter.com', { type: ActivityType.Watching });
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('https://twitter.com/') || message.content.startsWith('https://x.com/')) {
      await Handle(message);
    }
    if (message.mentions.has(client.user) && message.content == (`<@${client.user.id}>`)) {
      const embed = new EmbedBuilder()
        .setColor('#1DA1F2')
        .setTitle('XFixer')
        .addFields(
            { name: 'What is this?', value: 'XFixer is a bot that enhances Twitter/X embeds in Discord.' },
            { name: 'How does it work?', value: 'Just send a link to a Twitter/X post, and I will automatically reply with more information about the post.' },
            { name: 'How can I add this bot?', value: 'Visit https://mikn.link/xfixer/' },
            { name: 'Disclaimer', value: 'This bot is not affiliated with Twitter/X Corp.' }
        )
        .setFooter({ text: 'XFixer by MikanDev' });
      message.reply({ embeds: [embed] });
    }
    if (message.mentions.has(client.user) && message.content.includes(`<@${client.user.id}> steal`)) {
      try{ 
      const emoji = message.content.split(' ')[2];
      console.log(emoji);
      const emojiID = emoji.split(':')[2].replace('>', '');
      const emojiname = emoji.split(':')[1];
      const emojiURL = `https://cdn.discordapp.com/emojis/${emojiID}.png`;
      const response = await fetch(emojiURL);
      const attachment = new AttachmentBuilder(response.body, 'emoji.png');
      await message.guild.emojis.create(attachment, emojiname, "");
      message.reply({ content: `Successfully added ${emojiname} to this server!` });
      }
      catch (error) {
        message.reply({ content: 'Error adding emoji. Make sure you mention the emoji correctly.' });
        console.log(error);
      }
    }
    if (message.mentions.has(client.user) && message.content.includes(`<@${client.user.id}> asteal`)) {
      try{ 
      const emoji = message.content.split(' ')[2];
      console.log(emoji);
      const emojiID = emoji.split(':')[2].replace('>', '');
      const emojiname = emoji.split(':')[1];
      console.log(emojiname);
      const emojiURL = `https://cdn.discordapp.com/emojis/${emojiID}.gif`;
      const response = await fetch(emojiURL);
      const attachment = new AttachmentBuilder(response.body, 'emoji.gif');
      await message.guild.emojis.create(attachment, emojiname, "");
      message.reply({ content: `Successfully added ${emojiname} to this server!` });
      }
      catch (error) {
        message.reply({ content: 'Error adding emoji. Make sure you mention the emoji correctly.' });
        console.log(error);
      }
    }});

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === 'delete') {
    await interaction.message.delete();
  }
  if (interaction.commandName === 'settings') {
    
  }
  if (interaction.customId.startsWith('mode')) {
    const invoker = interaction.customId.split('-')[2];
    const mode = interaction.customId.split('-')[1];
    if (invoker === interaction.user.id) {
      if (mode === 'disable') {
        await setMode(interaction.guildId, 'disable');
        await interaction.reply({ content: 'Disabled XFixer for this server.', ephemeral: true });
      }
      if (mode === 'video') {
        await setMode(interaction.guildId, 'video');
        await interaction.reply({ content: 'Set XFixer to Video Only mode for this server.', ephemeral: true });
      }
      if (mode === 'full') {
        await setMode(interaction.guildId, 'full');
        await interaction.reply({ content: 'Set XFixer to Full Tweet mode for this server.', ephemeral: true });
      }
    }
  }
  if (interaction.customId === 'translate') {
    await HandleTranslate(interaction);
  }
}
);


client.login(process.env.DISCORD_TOKEN);