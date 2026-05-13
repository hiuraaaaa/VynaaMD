const fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else throw "Input nickname atau reply teks yang ingin dijadikan fakeloby!";

    if (!text) return m.reply('masukan nickname');

    try {
        m.reply(wait);

        const res = await fetch(`https://api.nexray.eu.cc/maker/fakelobyff?nickname=${encodeURIComponent(text)}`);
        if (!res.ok) throw new Error('failed');

        const buffer = await res.buffer();
        await conn.sendFile(m.chat, buffer, 'fakeloby.png', '', m);

    } catch (e) {
        throw `${eror}`;
    }
};

handler.help = ['fakeloby'];
handler.tags = ['maker'];
handler.command = /^(fakeloby|fakelobby)$/i;
handler.limit = true;
module.exports = handler;
