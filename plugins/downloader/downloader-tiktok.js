let axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vt.tiktok.com/ZSkGPK9Kj/`;

    if (!text.match(/tiktok/gi) && !text.match(/douyin/gi)) {
        throw `URL Tidak Ditemukan!`;
    }

    m.reply(wait);

    const fetchVtech = async () => {
        const res = await axios.get(`https://api.vtech.biz.id/api/download/tiktok?url=${text}&apikey=${vtech}`);
        const { video, title, audio } = res.data.result;
        if (!video?.[0]) throw new Error('no video');
        return { source: 'vtech', video, title, audio };
    };

    const fetchSiputzxV1 = async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(text)}`);
        if (!res.data.status) throw new Error('failed');
        const { title, author, media } = res.data.data;

        let videoUrl;
        const hd = media.find(x => x.quality === 'HD');
        const sd = media.find(x => x.quality === 'SD');

        if (hd) {
            try {
                const hdRes = await axios.get(hd.url);
                videoUrl = hdRes.data?.url || hd.backup;
            } catch {
                videoUrl = hd.backup || sd?.url;
            }
        } else {
            videoUrl = sd?.url;
        }

        if (!videoUrl) throw new Error('no media');
        return { source: 'siputzx_v1', videoUrl, title, author };
    };

    const fetchSiputzxV2 = async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(text)}`);
        if (!res.data.status) throw new Error('failed');
        const { no_watermark_link_hd, no_watermark_link, author_nickname, music_link } = res.data.data;
        const videoUrl = no_watermark_link_hd || no_watermark_link;
        if (!videoUrl) throw new Error('no video');
        return { source: 'siputzx_v2', videoUrl, author: author_nickname, music_link };
    };

    const result = await Promise.any([
        fetchVtech(),
        fetchSiputzxV1(),
        fetchSiputzxV2()
    ]).catch(() => { throw eror; });

    if (result.source === 'vtech') {
        const capt = `乂 *T I K T O K*\n\n◦ *Title* : ${result.title}\n`;
        if (result.video.length > 1) {
            for (let v of result.video) await conn.sendFile(m.chat, v, null, capt, m);
        } else {
            await conn.sendFile(m.chat, result.video[0], null, capt, m);
        }
        if (!result.audio?.[0]) {
            await conn.reply(m.chat, "_Audio tidak tersedia!_", m);
        } else {
            conn.sendMessage(m.chat, { audio: { url: result.audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });
        }

    } else if (result.source === 'siputzx_v1') {
        const capt = `乂 *T I K T O K*\n\n◦ *Title* : ${result.title}\n◦ *Author* : ${result.author}\n`;
        await conn.sendFile(m.chat, result.videoUrl, null, capt, m);

    } else if (result.source === 'siputzx_v2') {
        const capt = `乂 *T I K T O K*\n\n◦ *Author* : ${result.author}\n`;
        await conn.sendFile(m.chat, result.videoUrl, null, capt, m);
        if (result.music_link) {
            conn.sendMessage(m.chat, { audio: { url: result.music_link }, mimetype: 'audio/mpeg' }, { quoted: m });
        } else {
            await conn.reply(m.chat, "_Audio tidak tersedia!_", m);
        }
    }
};

handler.help = ['tiktok'];
handler.command = /^(tiktok|tt|tiktokdl|tiktoknowm)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;
