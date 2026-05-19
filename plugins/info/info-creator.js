let handler = async (m, { conn }) => {
  let name = global.nameowner
  let numberowner = global.numberowner
  let gmail = global.mail

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
item1.ORG:Owner Lumina Bot
item1.TEL;waid=${numberowner}:+${numberowner}
item1.X-ABLabel:Nomor Owner Bot
item2.EMAIL;type=INTERNET:${gmail}
item2.X-ABLabel:Email Owner
item3.ADR:;;🇮🇩 Indonesia;;;;
item3.X-ABADR:ac
item4.URL:${global.instagram || 'https://instagram.com/Xena'}
item4.X-ABLabel:Instagram
END:VCARD`

  const sentMsg = await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{ vcard }]
    }
  })

  await conn.reply(m.chat,
    `✨ *Info Owner Lumina*\n\n👤 Nama: *${name}*\n📱 Nomor: +${numberowner}\n📸 Instagram: ${global.instagram || 'https://instagram.com/Xena'}\n\n> _© Lumina by Xena_`,
    sentMsg
  )
}

handler.command = handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.limit = false

module.exports = handler
