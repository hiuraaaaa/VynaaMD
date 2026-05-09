let handler = async (m, { conn }) => {
    let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length
    let totalPlugins = Object.keys(global.plugins).length

    conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: `╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🌸 *V y n a a M D* 🌸
╰━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────────────
│ 📊 *TOTAL FITUR*
│─────────────────────
│ 🔌 Plugin Loaded : ${totalPlugins}
│ ✨ Total Fitur   : ${totalf}
╰─────────────────────

> _© VynaaMD by VynaaValerie_`,
            contextInfo: {
                externalAdReply: {
                    title: '🌸 VynaaMD — Total Fitur',
                    body: `${totalf} fitur aktif`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://a.top4top.io/p_37802zcmd1.png',
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
