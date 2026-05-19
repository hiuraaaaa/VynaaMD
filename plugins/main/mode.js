let handler = async (m, { conn }) => {
    let _uptime = process.uptime() * 1000
    let uptimex = clockString(_uptime)
    let users = Object.keys(global.db.data.users).length
    let banned = Object.entries(global.db.data.users).filter(([, u]) => u.banned).length
    let fitur = Object.entries(db.data.stats).length

    let tio = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃  ✨ *L u m i n a* ✨
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────
│ ⚡ *STATUS BOT*
│─────────────────────
│ 🌐 Mode     : ${global.opts['self'] ? '🔒 Self' : '🌍 Publik'}
│ ⏱️ Uptime   : ${uptimex}
│ 👥 Pengguna : ${users}
│ 🚫 Dibanned : ${banned}
│ 📊 Fitur    : ${fitur}
╰─────────────────────

> _Jika bot tidak merespon, kemungkinan sedang maintenance._
> _© Lumina by Xena_`.trim()

    conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: tio,
            contextInfo: {
                externalAdReply: {
                    title: '✨ Lumina — Status Bot',
                    body: `Uptime: ${uptimex}`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://c.termai.cc/i154/R43UHM1.jpg',
                    sourceUrl: global.gc || 'https://whatsapp.com'
                }
            },
            mentions: [m.sender]
        }
    }, {})
}

handler.help = ['mode']
handler.tags = ['main']
handler.customPrefix = /^(mode)$/i
handler.command = new RegExp
handler.limit = false

module.exports = handler

function clockString(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000))
    let daysms = ms % (24 * 60 * 60 * 1000)
    let hours = Math.floor(daysms / (60 * 60 * 1000))
    let hoursms = ms % (60 * 60 * 1000)
    let minutes = Math.floor(hoursms / (60 * 1000))
    let minutesms = ms % (60 * 1000)
    let sec = Math.floor(minutesms / 1000)
    return `${days}h ${hours}j ${minutes}m ${sec}d`
}
