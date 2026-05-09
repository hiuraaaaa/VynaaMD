let handler = async (m, { conn }) => {
  let text = `🌸 *Tim & Kredit VynaaMD*

╭─────────────────────
│ 🙏 *Terima kasih kepada:*
│─────────────────────
│ ☝️ Allah SWT — atas segalanya
│ 👑 VynaaValerie — Developer
│ 🔧 WhiskeySockets — Library Baileys
│ 💎 Semua pengguna VynaaMD
╰─────────────────────

> _© VynaaMD by VynaaValerie_`

  conn.relayMessage(m.chat, {
    extendedTextMessage: {
      text,
      contextInfo: {
        externalAdReply: {
          title: '🌸 VynaaMD — Tim & Kredit',
          body: 'by VynaaValerie',
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

handler.help = ['tqto', 'team']
handler.tags = ['info']
handler.command = /^(tqto|team)$/i

module.exports = handler
