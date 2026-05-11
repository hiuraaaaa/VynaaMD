let handler = async (m, { conn }) => {
  let text = `✨ *Tim & Kredit Lumina*

╭─────────────────────
│ 🙏 *Terima kasih kepada:*
│─────────────────────
│ ☝️ Allah SWT — atas segalanya
│ 👑 Xen444 — Developer
│ 🔧 WhiskeySockets — Library Baileys
│ 💎 Semua pengguna Lumina
╰─────────────────────

> _© Lumina by Xen4_`

  conn.relayMessage(m.chat, {
    extendedTextMessage: {
      text,
      contextInfo: {
        externalAdReply: {
          title: '✨ Lumina — Tim & Kredit',
          body: 'by Xen4',
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

handler.help = ['tqto', 'team']
handler.tags = ['info']
handler.command = /^(tqto|team)$/i

module.exports = handler
