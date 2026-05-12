let axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.sessionAI = conn.sessionAI ? conn.sessionAI : {};

    if (!text) throw `🚩 ${usedPrefix + command} *enable/disable*`;

    if (text === "enable") {
        conn.sessionAI[m.sender] = { sessionChat: [] };
        m.reply("Success create sessions chat!");
    } else if (text === "disable") {
        delete conn.sessionAI[m.sender];
        m.reply("Success delete sessions chat!");
    }
};

handler.before = async (m, { conn }) => {
    conn.sessionAI = conn.sessionAI ? conn.sessionAI : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.sessionAI[m.sender]) return;
    if ([".", "#", "!", "/", "\\"].some(prefix => m.text.startsWith(prefix))) return;

    if (conn.sessionAI[m.sender] && m.text) {
        const previousMessages = conn.sessionAI[m.sender].sessionChat || [];

        const historyContext = previousMessages.length > 0
            ? previousMessages.map((msg, i) => 
                i % 2 === 0 ? `User: ${msg}` : `Lumina: ${msg}`
              ).join('\n') + '\nUser: ' + m.text
            : m.text;

        try {
            const { data } = await axios.get('https://api.siputzx.my.id/api/ai/gptoss120b', {
                params: {
                    prompt: historyContext,
                    system: "Kamu adalah Lumina, asisten pribadi yang dibuat oleh Xena, siap membantu kapan pun!",
                    temperature: 0.7
                }
            });

            const result = data?.data?.response;

            if (result) {
                await m.reply(result);
                conn.sessionAI[m.sender].sessionChat = [
                    ...conn.sessionAI[m.sender].sessionChat,
                    m.text,
                    result
                ];
            } else {
                m.reply("Kesalahan dalam mengambil data");
            }
        } catch (e) {
            console.error(e?.response?.data || e.message);
            m.reply("Terjadi kesalahan saat menghubungi API.");
        }
    }
};

handler.command = ['autoai'];
handler.tags = ['ai'];
handler.help = ['autoai'].map(a => a + ' *enable/disable*');
handler.limit = true;

module.exports = handler;
