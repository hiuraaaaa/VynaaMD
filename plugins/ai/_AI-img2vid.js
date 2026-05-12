let uploadImage = require('../../lib/uploadImage');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || q.mediaType || '';

        if (!/^image/.test(mime) || /webp/.test(mime)) {
            return m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
        }

        const img = await q.download();
        const imageUrl = await uploadImage(img);

        await m.reply(wait);

        // Generate video
        const genRes = await fetch(`https://exsalapi.my.id/api/ai/video/wan-2.2/img2vid?image_url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(text || 'Animate this image smoothly')}&apikey=exs_hiura_7281855e`);
        const genData = await genRes.json();

        if (!genData.status) throw 'Gagal generate video';

        const pollUrl = genData.data.pollUrl;
        await m.reply('⏳ _Video sedang dibuat, mohon tunggu..._');

        // Polling sampai selesai
        let videoUrl = null;
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 5000));

            const pollRes = await fetch(`${pollUrl}&apikey=exs_hiura_7281855e`);
            const pollData = await pollRes.json();

            if (pollData.data.status === 'completed' && pollData.data.url) {
                videoUrl = pollData.data.url;
                break;
            }
        }

        if (!videoUrl) throw 'Timeout, video gagal dibuat';

        await conn.sendFile(m.chat, videoUrl, 'video.mp4', '✅ _Video selesai dibuat!_', m);

    } catch (e) {
        console.error("Error:", e?.message || e);
        throw eror;
    }
}

handler.command = handler.help = ['img2vid'];
handler.tags = ['ai'];
handler.limit = true;

module.exports = handler;
