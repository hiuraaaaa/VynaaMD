const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan pertanyaan!\n\ncontoh:\n${usedPrefix + command} Siapa kamu?`;

    try {
        m.reply(wait);

        const res = await fetch(`https://api-lumina-ashy.vercel.app/ai-chat/qwenn?prompt=${encodeURIComponent(text)}&model=qwen3.5-plus`);
        const data = await res.json();

        if (!data.status || !data.result?.response) throw new Error('failed');

        await m.reply(data.result.response);

    } catch (e) {
        throw `${eror}`;
    }
};

handler.help = ['qwen'];
handler.tags = ['ai'];
handler.command = /^(qwen|qwenn|qwen3)$/i;
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;
