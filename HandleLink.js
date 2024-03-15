import fetch from 'node-fetch'
import { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

async function Handle(message) {
    const deleteButton = new ButtonBuilder()
    .setCustomId('delete')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('<:raidenult:1141299674691670128>');

    const translateButton = new ButtonBuilder()
        .setCustomId('translate')
        .setLabel('Translate to English')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🌐');

    const row = new ActionRowBuilder()
        .addComponents(deleteButton, translateButton);

    const delete_row = new ActionRowBuilder()
        .addComponents(deleteButton);

    const url = message.content;
    const urlParams = url.split('/').slice(3);
    const requestURL = `https://api.vxtwitter.com/${urlParams[0]}/${urlParams[1]}/${urlParams[2]}`;
    const response = await fetch(requestURL);

    if (response.ok) {
        const json = await response.json();
        const date = new Date(json.date);
        const qrt = json.qrtURL || null;
        const url = json.tweetURL;
        const id = json.id;
        const likes = json.likes;
        const retweets = json.retweets;
        const replies = json.replies;
        const media = json.mediaURLs;
        const text = json.text || null;
        const username = json.user_name;
        const pfp = json.user_profile_image_url;
        const handle = json.user_screen_name;
    
        const mediaAttachments = media.map(mediaURL => {
            if (mediaURL.startsWith('https://video.twimg.com/')) {
                return mediaURL;
            }

            if (mediaURL.startsWith('https://pbs.twimg.com/')) {
            let mediaID = mediaURL.split('/').slice(-1)[0];
            mediaID = mediaID.split('.')[0];
            return mediaID;
        }});
    
        const mediaIDsString = mediaAttachments.join('/');
    
        let mosaicURL = (`https://twitter-mosaic.mikandev.tech/jpeg/${id}/${mediaIDsString}`);

        console.log(mediaAttachments);

        if (mediaAttachments.length === 0) {
            const statsEmbed = new EmbedBuilder()
                .setColor('#1DA1F2')
                .setAuthor({ name: 'Post Stats' })
                .setTitle(`❤ ` + likes + ` | 🔁 ` + retweets + ` | 💬 ` + replies)
                .setTimestamp(date)
                .setFooter({ text: `XFixer by MikanDev`, url: `https://xfixer.mikn.dev/` });

            return message.reply({ embeds: [statsEmbed], components: [row], allowedMentions: { repliedUser: false } });
        }

        if (mediaAttachments.length === 1 || mediaAttachments[0].startsWith('https://video.twimg.com/')) {
            const statsEmbed = new EmbedBuilder()
                .setColor('#1DA1F2')
                .setAuthor({ name: 'Post Stats' })
                .setTitle(`❤ ` + likes + ` | 🔁 ` + retweets + ` | 💬 ` + replies)
                .setTimestamp(date)
                .setFooter({ text: `XFixer by MikanDev`, url: `https://xfixer.mikn.dev/` });

            return message.reply({ embeds: [statsEmbed], components: [row], allowedMentions: { repliedUser: false } });
        }

        if (mediaAttachments.length === 1 && mediaAttachments[0].startsWith('https://video.twimg.com/')) {
            const videoURL = mediaAttachments.length > 0 ? mediaAttachments[0] : null;
            const statsEmbed = new EmbedBuilder()
                .setColor('#1DA1F2')
                .setAuthor({ name: 'Post Stats' })
                .setTitle(`❤ ` + likes + ` | 🔁 ` + retweets + ` | 💬 ` + replies)
                .setTimestamp(date)
                .setFooter({ text: `XFixer by MikanDev`, url: `https://xfixer.mikn.dev/` });

            message.reply({ embeds: [statsEmbed], components: [row], allowedMentions: { repliedUser: false } });
            return message.channel.send({ content: `Attached video:\n${videoURL}`, components: [delete_row] });
        }
    
        const videoURL = mediaAttachments.length > 0 ? mediaAttachments[0] : null;
        console.log(videoURL);
    
        const ImageEmbed = new EmbedBuilder()
            .setColor('#1DA1F2')
            .setTitle(`Stats: ❤ ` + likes + ` | 🔁 ` + retweets + ` | 💬 ` + replies)
            .setAuthor({ name: `This post contains multiple images.`})
            .setImage(mosaicURL || videoURL || null)
            .setTimestamp(date)
            .setFooter({ text: `XFixer by MikanDev`, url: `https://xfixer.mikn.dev/` });
    
        message.reply({ embeds: [ImageEmbed], components: [row], allowedMentions: { repliedUser: false } });
        if (videoURL.startsWith('https://video.twimg.com/')) {
            message.reply({ content: `Attached video:\n${videoURL}`, components: [delete_row] });
        }
        if (qrt) {
            message.channel.send({ embeds: [qrtEmbed] });
        }
    }
}

export { Handle };