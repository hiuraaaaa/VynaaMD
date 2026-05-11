process.env.TZ = 'Asia/Jakarta'

const axios = require('axios')
const sharp = require('sharp')
const moment = require('moment-timezone')

let arrayMenu = [
  'all',
  'ai',
  'main',
  'downloader',
  'database',
  'rpg',
  'rpgG',
  'sticker',
  'advanced',
  'xp',
  'fun',
  'game',
  'github',
  'group',
  'image',
  'nsfw',
  'info',
  'internet',
  'islam',
  'kerang',
  'maker',
  'news',
  'owner',
  'voice',
  'quotes',
  'store',
  'stalk',
  'shortlink',
  'tools',
  'anonymous'
]

const allTags = {
  all: 'SEMUA MENU',
  ai: 'AI',
  main: 'UTAMA',
  downloader: 'DOWNLOADER',
  database: 'DATABASE',
  rpg: 'RPG',
  rpgG: 'RPG GUILD',
  sticker: 'STICKER',
  advanced: 'ADVANCED',
  xp: 'XP & LEVEL',
  fun: 'FUN',
  game: 'GAME',
  github: 'GITHUB',
  group: 'GROUP',
  image: 'IMAGE',
  nsfw: 'NSFW',
  info: 'INFO',
  internet: 'INTERNET',
  islam: 'ISLAM',
  kerang: 'KERANG AJAIB',
  maker: 'MAKER',
  news: 'NEWS',
  owner: 'OWNER',
  voice: 'VOICE',
  quotes: 'QUOTES',
  store: 'STORE',
  stalk: 'STALK',
  shortlink: 'SHORTLINK',
  tools: 'TOOLS',
  anonymous: 'ANONYMOUS'
}

const THUMB_URL = 'https://d.uguu.se/QyctVeJW.jpg'
const SOURCE = global.gc || 'https://whatsapp.com'

let cachedThumb = null

async function getThumbnail() {
  if (cachedThumb) return cachedThumb

  try {
    const res = await axios.get(THUMB_URL, {
      responseType: 'arraybuffer',
      timeout: 10000
    })

    cachedThumb = await sharp(Buffer.from(res.data))
      .resize(500, 300, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer()

  } catch (e) {
    cachedThumb = null
  }

  return cachedThumb
}

let handler = async (m, { conn, usedPrefix, args }) => {
  try {
    let user = global.db.data.users[m.sender] || {}

    let level = user.level || 0
    let limit = user.limit || 0
    let name = m.pushName || 'User'

    let input = (args[0] || '').toLowerCase()

    let now = moment().tz('Asia/Jakarta')
    let tanggal = now.format('DD/MM/YYYY')
    let jam = now.format('HH:mm:ss')

    let uptime = clockString(process.uptime() * 1000)

    let thumb = await getThumbnail()

    let plugins = Object.values(global.plugins)
      .filter(v => v.help && !v.disabled)
      .map(v => {
        return {
          help: Array.isArray(v.help) ? v.help : [v.help],
          tags: Array.isArray(v.tags) ? v.tags : [v.tags],
          premium: v.premium,
          limit: v.limit,
          customPrefix: v.customPrefix
        }
      })

    // =========================
    // MENU UTAMA
    // =========================
    if (!input) {

      let categoryText = ''

      for (let tag of arrayMenu) {
        if (tag === 'all') continue

        categoryText += `│◦ ${usedPrefix}menu ${tag}\n`
      }

      let text = `
╭━━━〔 LUMINA 〕━━━⬣
│
│◦ Halo ${name}
│◦ Prefix : ${usedPrefix}
│◦ Level : ${level}
│◦ Limit : ${limit}
│
│◦ Date : ${tanggal}
│◦ Time : ${jam} WIB
│◦ Runtime : ${uptime}
│
├─〔 LIST MENU 〕
${categoryText}│
├─〔 INFO 〕
│◦ Ketik ${usedPrefix}menu all
│◦ Untuk melihat semua menu
│
╰━━━〔 XEN444 〕━━⬣
`.trim()

      let externalAdReply = {
        title: 'LUMINA WHATSAPP BOT',
        body: `Runtime ${uptime}`,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: SOURCE,
        previewType: 'PHOTO'
      }

      if (thumb) externalAdReply.thumbnail = thumb

      return conn.sendMessage(m.chat, {
        text,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply
        }
      }, { quoted: m })
    }

    // =========================
    // MENU TIDAK ADA
    // =========================
    if (!allTags[input]) {
      return m.reply(`
Menu *${input}* tidak ditemukan.

Ketik:
${usedPrefix}menu
`.trim())
    }

    // =========================
    // RENDER CATEGORY
    // =========================
    const renderCategory = (tag) => {

      let cmds = plugins.filter(v => v.tags.includes(tag))

      let txt = `
╭━━━〔 ${allTags[tag]} 〕━━━⬣
│
`.trim()

      if (cmds.length < 1) {
        txt += `\n│◦ Tidak ada menu`
      }

      for (let cmd of cmds) {

        for (let h of cmd.help) {

          let isPremium = cmd.premium ? ' Ⓟ' : ''
          let isLimit = cmd.limit ? ' Ⓛ' : ''

          txt += `\n│◦ ${cmd.customPrefix ? '' : usedPrefix}${h}${isLimit}${isPremium}`
        }
      }

      txt += `\n│\n╰━━━━━━━━━━━━⬣\n`

      return txt
    }

    // =========================
    // MENU ALL
    // =========================
    let result = `
╭━━━〔 LUMINA MENU 〕━━━⬣
│
│◦ User : ${name}
│◦ Level : ${level}
│◦ Limit : ${limit}
│◦ Time : ${jam} WIB
│
╰━━━━━━━━━━━━⬣

`.trim()

    if (input === 'all') {

      for (let tag of arrayMenu) {

        if (tag === 'all') continue

        result += '\n\n' + renderCategory(tag)
      }

    } else {

      result += '\n\n' + renderCategory(input)
    }

    result += `
> Ⓛ = memakai limit
> Ⓟ = premium only
`.trim()

    let externalAdReply2 = {
      title: `MENU ${allTags[input]}`,
      body: `Lumina WhatsApp Bot`,
      mediaType: 1,
      renderLargerThumbnail: true,
      sourceUrl: SOURCE,
      previewType: 'PHOTO'
    }

    if (thumb) externalAdReply2.thumbnail = thumb

    await conn.sendMessage(m.chat, {
      text: result,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: externalAdReply2
      }
    }, { quoted: m })

  } catch (e) {
    console.log(e)

    m.reply('Menu error.')
  }
}

handler.help = ['menu', 'help']
handler.tags = ['main']
handler.command = /^(menu|help)$/i

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
