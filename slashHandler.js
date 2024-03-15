import { Client, GatewayIntentBits, ActivityType, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export async function openSettings(interaction) {
    const modeSelector = new StringSelectMenuBuilder()
        .setCustomId('mode')
        .setPlaceholder('Operating Mode')
        .addOptions([
            { label: 'Video Only', value: `mode-video-${interaction.user.id}`, description: 'Only reply with a URL of the attachedd video (if present)' },
            { label: 'Full Tweet', value: `mode-full-${interaction.user.id}`, description: 'Reply with a full embed of the tweet' },
            { label: 'Disable', value: `mode-disable-${interaction.user.id}`, description: 'Disable XFixer for this server' },
        ]);

    const row = new ActionRowBuilder()
        .addComponents(modeSelector);

    const embed = new EmbedBuilder()
        .setColor('#1DA1F2')
        .setTitle('XFixer Settings')
        .setDescription('Select a setting to change.')
        .addFields(
            { name: 'Operating mode', value: 'Change how XFixer replies to posts in this server' },
        )
        .setFooter({ text: 'XFixer by MikanDev' });

    await interaction.reply({ embeds: [embed], components: [row] });
}