import fetch from 'node-fetch'
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';


async function Handle(message) {
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

        if (mediaAttachments.length === 1 && !mediaAttachments[0].startsWith('https://video.twimg.com/')) {
            mosaicURL = `https://pbs.twimg.com/media/${mediaAttachments[0]}?format=jpg`;
        }
    
        const videoURL = mediaAttachments.length > 0 ? mediaAttachments[0] : null;
        console.log(videoURL);

        const textWithoutUrls = text.replace(/https:\/\/t.co\/[a-zA-Z0-9]+/g, '');
    
        const embed = new EmbedBuilder()
            .setColor('#1DA1F2')
            .setTitle(`❤ ` + likes + ` | 🔁 ` + retweets + ` | 💬 ` + replies)
            .setURL(url)
            .setThumbnail(pfp)
            .setAuthor({ name: `${username} (@${handle})`})
            .setDescription(textWithoutUrls || null)
            .setImage(mosaicURL || videoURL || null)
            .setTimestamp(date)
            .setFooter({ text: `XFixer by MikanDev`, url: `https://xfixer.mikn.dev/` });
    
        message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } });
        if (videoURL.startsWith('https://video.twimg.com/')) {
            message.channel.send(`Attached video:\n${videoURL}`);
        }
        if (qrt) {
            message.channel.send({ embeds: [qrtEmbed] });
        }
    }
}

export { Handle };