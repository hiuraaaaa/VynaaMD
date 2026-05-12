let FormData = require('form-data');
let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text && !(m.quoted && m.quoted.msg)) throw `Masukkan pertanyaan!\n\n*Contoh:* ${usedPrefix + command} gambar apa ini`

    try {
        await m.reply(wait)

        let formData = new FormData()
        formData.append('question', text || 'Apa ini?')
        formData.append('sessionId', m.sender.replace(/[^0-9]/g, ''))
        formData.append('system', 'Kamu adalah Lumina, asisten buatan Xena. Jawab pertanyaan user secara detail dan mudah dipahami.')

        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || q.mediaType || ''

        if (mime) {
            const media = await q.download()
            let ext = mime.split('/')[1]?.split(';')[0] || 'jpg'

            // Fix ext untuk video
            if (mime.includes('mp4')) ext = 'mp4'
            else if (mime.includes('webm')) ext = 'webm'
            else if (mime.includes('quicktime')) ext = 'mov'
            else if (mime.includes('jpeg')) ext = 'jpg'
            else if (mime.includes('png')) ext = 'png'
            else if (mime.includes('webp')) ext = 'webp'
            else if (mime.includes('pdf')) ext = 'pdf'

            formData.append('file', media, {
                filename: `file.${ext}`,
                contentType: mime
            })
        }

        const res = await fetch('https://api.covenant.sbs/api/ai/gemini', {
            method: 'POST',
            headers: {
                'x-api-key': 'cov_live_2869167ed959dcd9ffa5f41abc43cca43e77e0b0af86fc14',
                ...formData.getHeaders()
            },
            body: formData
        })

        const data = await res.json()
        if (!data.status) throw 'Gagal mengambil response'

        await m.reply(data.data.result)

    } catch (e) {
        console.error("Error:", e?.message || e)
        throw eror
    }
}

handler.command = handler.help = ['gemini'];
handler.tags = ['ai'];
handler.limit = true;

module.exports = handler;
