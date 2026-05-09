process.env.TZ = 'Asia/Jakarta'

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const moment = require('moment-timezone')
const levelling = require('../../lib/levelling')

let arrayMenu = [
  'all','ai','main','downloader','database',
  'rpg','rpgG','sticker','advanced','xp',
  'fun','game','github','group','image',
  'nsfw','info','internet','islam','kerang',
  'maker','news','owner','voice','quotes',
  'store','stalk','shortlink','tools','anonymous',''
]

const allTags = {
  'all':        'SEMUA MENU',
  'ai':         'AI',
  'main':       'UTAMA',
  'downloader': 'DOWNLOADER',
  'database':   'DATABASE',
  'rpg':        'RPG',
  'rpgG':       'RPG GUILD',
  'sticker':    'STICKER',
  'advanced':   'ADVANCED',
  'xp':         'XP & LEVEL',
  'fun':        'FUN',
  'game':       'GAME',
  'github':     'GITHUB',
  'group':      'GROUP',
  'image':      'IMAGE',
  'nsfw':       'NSFW',
  'info':       'INFO',
  'internet':   'INTERNET',
  'islam':      'ISLAM',
  'kerang':     'KERANG AJAIB',
  'maker':      'MAKER',
  'news':       'NEWS',
  'owner':      'OWNER',
  'voice':      'VOICE',
  'quotes':     'QUOTES',
  'store':      'STORE',
  'stalk':      'STALK',
  'shortlink':  'SHORTLINK',
  'tools':      'TOOLS',
  'anonymous':  'ANONYMOUS',
  '':           'LAINNYA'
}

const THUMB = 'https://a.top4top.io/p_37802zcmd1.png'
const SOURCE = global.gc || 'https://whatsapp.com'

async function getBuffer(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  return res.data
}

let handler = async (m, { conn, usedPrefix: _p, args = [] }) => {
  try {

    let user = global.db.data.users[m.sender]

    let exp = user.exp
    let limit = user.limit
    let level = user.level

    let name = m.pushName || `@${m.sender.split('@')[0]}`
    let teks = (args[0] || '').toLowerCase()

    let d = moment().tz('Asia/Jakarta')

    let date = d.format('DD MMMM YYYY')
    let time = d.format('HH:mm:ss [WIB]')
    let uptime = clockString(process.uptime() * 1000)

    let thumb = await getBuffer(THUMB)

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help)
          ? plugin.help
          : [plugin.help],
        tags: Array.isArray(plugin.tags)
          ? plugin.tags
          : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium
      }))

    // ================= MENU UTAMA =================

    if (!teks) {

      let cats = arrayMenu.filter(
        t => t && allTags[t] && t !== 'all'
      )

      let rows = []

      for (let i = 0; i < cats.length; i += 3) {

        let row = cats
          .slice(i, i + 3)
          .map(t => `• ${_p}menu ${t}`)
          .join('\n')

        rows.push(row)
      }

      let menuList = `
*VYNAAMD BOT WHATSAPP*

Halo, *${name}*

╭─❏ INFO USER
│ • Level : ${level}
│ • Limit : ${limit}
│ • Exp   : ${exp}
╰──────────

╭─❏ BOT INFO
│ • Prefix  : ${_p}
│ • Runtime : ${uptime}
│ • Date    : ${date}
│ • Time    : ${time}
╰──────────

*DAFTAR MENU*

${rows.join('\n\n')}

• ${_p}menu all

_Ketik ${_p}menu kategori_
_untuk melihat detail menu._

© VynaaMD By VynaaValerie
`.trim()

      await conn.sendMessage(m.chat, {
        text: menuList,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: 'VYNAAMD BOT',
            body: `Prefix ${_p} • Level ${level}`,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: thumb,
            sourceUrl: SOURCE,
            previewType: 'PHOTO'
          }
        }
      }, { quoted: m })

      return
    }

    // ================= MENU TIDAK ADA =================

    if (!allTags[teks]) {
      return m.reply(
`Menu *"${teks}"* tidak ditemukan.

Ketik *${_p}menu* untuk melihat daftar menu.`
      )
    }

    // ================= RENDER CATEGORY =================

    const renderCategory = (tag) => {

      let cmds = help.filter(menu =>
        menu.tags &&
        menu.tags.includes(tag) &&
        menu.help
      )

      let lines = []

      for (let menu of cmds) {

        for (let h of menu.help) {

          let cmd = menu.prefix
            ? h
            : _p + h

          let flags =
            (menu.limit ? ' ⓛ' : '') +
            (menu.premium ? ' 🅟' : '')

          lines.push(`│ • ${cmd}${flags}`)
        }
      }

      return `
╭─❏ ${allTags[tag]}
${lines.join('\n') || '│ • -'}
╰──────────
`.trim()
    }

    // ================= MENU CATEGORY =================

    let menuCategory = `
*VYNAAMD BOT*

Halo, *${name}*

📅 ${date}
🕒 ${time}

`.trim()

    if (teks === 'all') {

      for (let tag of arrayMenu) {

        if (tag !== 'all' && allTags[tag]) {
          menuCategory += '\n\n' + renderCategory(tag)
        }
      }

    } else {

      menuCategory += '\n\n' + renderCategory(teks)
    }

    menuCategory += `

ⓛ = LIMIT
🅟 = PREMIUM

© VynaaMD By VynaaValerie
`

    await conn.sendMessage(m.chat, {
      text: menuCategory,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `MENU ${allTags[teks]}`,
          body: `VynaaMD • ${_p}menu`,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnail: thumb,
          sourceUrl: SOURCE,
          previewType: 'PHOTO'
        }
      }
    }, { quoted: m })

  } catch (e) {

    console.log(e)

    m.reply('Menu error, coba lagi.')
  }
}

handler.help = ['menu', 'help']
handler.tags = ['main']
handler.command = /^(menu|help)$/i
handler.exp = 3

module.exports = handler

function clockString(ms) {

  if (isNaN(ms)) return '--'

  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => v.toString().padStart(2, 0))
    .join(':')
}