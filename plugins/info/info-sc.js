let handler = async (m, { conn }) => {
  let user = `@${m.sender.split('@')[0]}`
  let text = `🌸 *Script Info — VynaaMD*

╭─────────────────────
│ 🤖 Bot      : VynaaMD
│ 👤 Owner    : VynaaValerie
│ 📸 IG       : @VynaaValerie
│ 🔧 Library  : Baileys (WhiskeySockets)
│ 💻 Runtime  : Node.js
│ 🗓️ Updated  : 2025/2026
╰─────────────────────

Hai ${user}, terima kasih sudah menggunakan *VynaaMD Bot*! 🌸

> _© VynaaMD by VynaaValerie_`

  conn.relayMessage(m.chat, {
    extendedTextMessage: {
      text,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: '🌸 VynaaMD Bot',
          body: 'Script by VynaaValerie',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://a.top4top.io/p_37802zcmd1.png',
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
