let axios = require('axios');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* ${usedPrefix + command} siapa kamu`

    try {
        await m.reply(wait)
        const { data } = await axios.get('https://exsalapi.my.id/api/ai/text/llama-4', {
            timeout: 15000,
            params: {
                text: text,
                session_id: m.sender.replace(/[^0-9]/g, ''),
                apikey: 'exs_hiura_7281855e'
            }
        });

        const result = data?.data?.content;

        if (result) {
            await m.reply(result);
        } else {
            m.reply(eror);
        }
    } catch (e) {
        console.error("API Error:", e?.response?.status, e?.response?.data || e.message);
        throw eror;
    }
}

handler.command = handler.help = ['llama'];
handler.tags = ['ai'];
handler.limit = true;

module.exports = handler;
