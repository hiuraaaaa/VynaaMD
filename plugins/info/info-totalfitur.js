let handler = async (m, { conn }) => {
    let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length
    let totalPlugins = Object.keys(global.plugins).length

    conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: `╭━━━━━━━━━━━━━━━━━━━━━╮
┃  ✨ *L u m i n a* ✨
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────
│ 📊 *TOTAL FITUR*
│─────────────────────
│ 🔌 Plugin Loaded : ${totalPlugins}
│ ✨ Total Fitur   : ${totalf}
╰─────────────────────

> _© Lumina by Xen4_`,
            contextInfo: {
                externalAdReply: {
                    title: '✨ Lumina — Total Fitur',
                    body: `${totalf} fitur aktif`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://d.uguu.se/QyctVeJW.jpg',
                    sourceUrl: global.gc || 'https://whatsapp.com'
                }
            }
        }
    }, {})
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur']

module.exports = handler
