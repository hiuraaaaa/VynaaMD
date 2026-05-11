let handler = async (m, { conn }) => {
  let user = `@${m.sender.split('@')[0]}`
  let text = `✨ *Script Info — Lumina*

╭─────────────────────
│ 🤖 Bot      : Lumina
│ 👤 Owner    : Xen4
│ 📸 IG       : @Yvone.agd
│ 🔧 Library  : Baileys (WhiskeySockets)
│ 💻 Runtime  : Node.js
│ 🗓️ Updated  : 2025/2026
╰─────────────────────

Hai ${user}, terima kasih sudah menggunakan *Lumina Bot*! ✨

> _© Lumina by Xen4_`

  conn.relayMessage(m.chat, {
    extendedTextMessage: {
      text,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: '✨ Lumina Bot',
          body: 'Script by Xen4',
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

handler.help = ['sc', 'sourcecode']
handler.tags = ['info']
handler.command = /^(sc|sourcecode)$/i

module.exports = handler
