let handler = async (m, { conn }) => {
    let _uptime = process.uptime() * 1000
    let tio = clockString(_uptime)
    let time = require('moment-timezone').tz('Asia/Jakarta').format('HH:mm:ss [WIB]')

    let txt = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃  ✨ *L u m i n a* ✨
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────
│ ⏱️ *RUNTIME BOT*
│─────────────────────
│ 🕐 Waktu : ${time}
│ ⚡ Uptime : ${tio}
╰─────────────────────

> _© Lumina by Xen4_`

    conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: txt,
            contextInfo: {
                externalAdReply: {
                    title: '✨ Lumina — Runtime',
                    body: `Uptime: ${tio}`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://d.uguu.se/QyctVeJW.jpg',
                    sourceUrl: global.gc || 'https://whatsapp.com'
                }
            },
            mentions: [m.sender]
        }
    }, {})
}

handler.help = ['runtime', 'uptime']
handler.tags = ['info']
handler.command = /^(uptime|runtime)$/i

module.exports = handler

function clockString(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000))
    let daysms = ms % (24 * 60 * 60 * 1000)
    let hours = Math.floor(daysms / (60 * 60 * 1000))
    let hoursms = ms % (60 * 60 * 1000)
    let minutes = Math.floor(hoursms / (60 * 1000))
    let minutesms = ms % (60 * 1000)
    let sec = Math.floor(minutesms / 1000)
    return `${days} Hari ${hours} Jam ${minutes} Menit ${sec} Detik`
}
