let fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* ${usedPrefix + command} siapa pemenang UCL terbaru`

    try {
        await m.reply(wait)
        let res = await (await fetch(`https://hiuraaa-Lumina-Space.hf.space/run?service=ai/perplexity&question=${encodeURIComponent(text)}`, {
            headers: { 'x-key': 'lumina' }
        })).json()

        if (!res.status) throw 'Gagal mengambil data'

        let answer = res.result.answer
        let sources = res.result.sources

        let sourceText = sources.slice(0, 3).map((s, i) => `[${i+1}] ${s.title}\n${s.url}`).join('\n\n')

        await m.reply(`${answer}\n\n*Sumber:*\n${sourceText}`)
    } catch (e) {
        throw eror
    }
}

handler.command = handler.help = ['perplexity', 'perplex', 'aiperplexity'];
handler.tags = ['ai'];
handler.limit = true

module.exports = handler;
