require("dotenv").config();

// ===== OWNER & MODERATOR =====
global.owner       = ["62882006639544"];
global.mods        = ["62882006639544"];
global.prems       = ["62882006639544"];

// ===== IDENTITAS BOT =====
global.nameowner   = "Xena";
global.numberowner = "62882006639544";
global.wm          = "© Lumina by Xena";
global.packname    = "✨ Lumina";
global.author      = "Xena";

// ===== KONTAK & SOSIAL =====
global.mail        = "support@vtech.biz.id";
global.gc          = "https://chat.whatsapp.com/IweqL2NAVve5ZKcoagMizns";
global.instagram   = "https://instagram.com/yvone";

// ===== PESAN SISTEM =====
global.wait        = "⏳ _*Tunggu sebentar, sedang diproses...*_";
global.eror        = "❌ _*Terjadi kesalahan, coba lagi nanti!*_";
global.stiker_wait = "✨ *Stiker sedang dibuat, tunggu ya...*";

// ===== PENGATURAN BOT =====
global.maxwarn     = "5";
global.autobio     = false;
global.antiporn    = false;
global.spam        = false;
global.gcspam      = false;

// ===== API KEY =====
global.vtech = "sk-6bdb7d175063";
// global.vtech = process.env.API_KEY_VTECH;

global.APIs = {
    vtech: "https://api.vtech.biz.id",
};

global.APIKeys = {
    "https://api.vtech.biz.id": global.vtech,
};

// ===== AUTO RELOAD =====
let fs    = require("fs");
let chalk = require("chalk");
let file  = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright("Update 'config.js'"));
    delete require.cache[file];
    require(file);
});
