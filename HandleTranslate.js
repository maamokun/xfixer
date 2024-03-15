import { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

async function HandleTranslate(interaction) {
    await interaction.reply({ content: 'Translation is currently unavailable. It will be reenabled in a future update.', ephemeral: true });
}

export { HandleTranslate };