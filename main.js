// ============================================================
//  main.js  –  Hasil deobfuscate dari main.js (VYNABOTS)
//  Fungsi 100% sama, hanya nama variabel diperjelas
// ============================================================

// Set Node.js agar menerima semua TLS certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

(async () => {
  // ── Imports ──────────────────────────────────────────────
  require('./config');

  const { loadBaileys } = await import('./baileys-loader.mjs');
  const Baileys = await loadBaileys();

  const {
    useMultiFileAuthState,
    DisconnectReason,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    proto,
    Browsers,
  } = Baileys;

  const NodeCache    = require('node-cache');
  const pino         = require('pino');
  const ws           = require('ws');
  const path         = require('path');
  const fs           = require('fs');
  const os           = require('os');
  const yargs        = require('yargs/yargs');
  const childProcess = require('child_process');
  const lodash       = require('lodash');
  const syntaxError  = require('syntax-error');
  const chalk        = require('chalk');
  const nodeFetch    = require('node-fetch');
  const readline     = require('readline');

  let baileysSock = require('./lib/simple');

  // ── Load lowdb (database lokal) ──────────────────────────
  var lowdbModule;
  try {
    lowdbModule = require('lowdb');
  } catch (_) {
    lowdbModule = require('./lib/lowdb');
  }
  const { Low, JSONFile } = lowdbModule;

  const mongoDB = require('./lib/mongoDB');

  // ── Setup readline interface ──────────────────────────────
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });
  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

  // ── Helper: build API URL ─────────────────────────────────
  global['API'] = (apiName, endpoint = '/', params = {}, apiKey) =>
    (apiName in global['APIs'] ? global['APIs'][apiName] : apiName) +
    endpoint +
    (params || apiKey
      ? '?' +
        new URLSearchParams(
          Object.fromEntries({
            ...params,
            ...(apiKey
              ? {
                  [apiKey]:
                    global['APIKeys'][
                      apiName in global['APIs'] ? global['APIs'][apiName] : apiName
                    ],
                }
              : {}),
          })
        )
      : '');

  // ── Global timestamp ──────────────────────────────────────
  global['timestamp'] = { start: new Date() };

  // ── Parse CLI args ────────────────────────────────────────
  global['opts'] = new Object(
    yargs(process.argv.slice(2)).exitProcess(false).parse()
  );

  // ── Prefix regex ──────────────────────────────────────────
  global['prefix'] = new RegExp(
    '^[' +
      (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(
        /[|\\{}()[\]^$+*?.\-\^]/g,
        '\\$&'
      ) +
      ']'
  );

  // ── Setup database ────────────────────────────────────────
  global['db'] = new Low(
    /https?:\/\//.test(opts['db'] || '')
      ? new cloudDBAdapter(opts['db'])
      : /mongodb/.test(opts['db'])
      ? new mongoDB(opts['db'])
      : new JSONFile((opts['_'][0] ? opts['_'][0] + '_' : '') + 'database.json')
  );
  global['DATABASE'] = global['db'];

  // ── loadDatabase function ─────────────────────────────────
  global['loadDatabase'] = async function loadDatabase() {
    if (global['db']['READ']) {
      return new Promise((resolve) =>
        setInterval(function () {
          if (!global['db']['READ']) {
            clearInterval(this);
            resolve(
              global['db']['data'] == null ? global['loadDatabase']() : global['db']['data']
            );
          }
        }, 1000)
      );
    }

    if (global['db']['data'] !== null) return;

    global['db']['READ'] = true;
    await global['db'].read();
    global['db']['READ'] = false;

    global['db']['data'] = {
      users:   {},
      chats:   {},
      stats:   {},
      msgs:    {},
      sticker: {},
      ...global['db']['data'] || {},
    };

    global['db']['chain'] = lodash.chain(global['db']['data']);
  };

  loadDatabase();

  // ── Deteksi OS untuk info browser Baileys ─────────────────
  var getBrowserInfo = function (botName = 'Chrome') {
    const platform = os.platform();
    const osName =
      platform === 'win32'
        ? 'Windows'
        : platform === 'darwin'
        ? 'MacOS'
        : 'Linux';
    const version = osName === 'Linux' ? Browsers.ubuntu(botName)[2] : 'N/A';
    return [osName, botName, version];
  };

  // ── Session path ──────────────────────────────────────────
  const sessionPath = '' + (opts['_'][0] || 'sessions');
  global['isInit'] = !fs.existsSync(sessionPath);

  // ── Load auth state & Baileys versi terbaru ───────────────
  const { state, saveState, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(
    chalk.bgGreen('-- using WA v' + version.join('.') + ', isLatest: ' + isLatest + ' --')
  );

  // ── Konfigurasi socket Baileys ────────────────────────────
  const msgRetryCache = new NodeCache();

  const socketConfig = {
    printQRInTerminal:              false,
    syncFullHistory:                true,
    markOnlineOnConnect:            true,
    connectTimeoutMs:               60000,
    defaultQueryTimeoutMs:          0,
    keepAliveIntervalMs:            10000,
    generateHighQualityLinkPreview: true,

    patchMessageBeforeSending: (msg) => {
      const isSpecial = !!(
        msg['buttonsMessage'] ||
        msg['templateMessage'] ||
        msg['listMessage']
      );
      if (isSpecial) {
        msg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...msg,
            },
          },
        };
      }
      return msg;
    },

    auth: {
      creds: state['creds'],
      keys:  makeCacheableSignalKeyStore(
        state['keys'],
        pino().child({ level: 'silent', stream: 'store' })
      ),
    },

    msgRetryCounterCache: msgRetryCache,
    browser:              getBrowserInfo(),
    logger:               pino({ level: 'silent' }),
    version:              version,
  };

  // ── Buat koneksi WA ───────────────────────────────────────
  global['conn'] = baileysSock['makeWASocket'](socketConfig);

  // ── Interval: auto-save DB & bersihkan folder tmp ─────────
  if (!opts['test']) {
    if (global['db']) {
      setInterval(async () => {
        if (global['db']['data']) await global['db'].write();

        if (!opts['child'] && (global['support'] || {})['find']) {
          let tmpDirs = [os.tmpdir(), 'tmp'];
          tmpDirs.forEach((dir) =>
            childProcess.spawn('find', [dir, '-amin', '3', '-type', 'f', '-delete'])
          );
        }
      }, 30 * 1000);
    }
  }

  // ── Handler: connection.update ────────────────────────────
  async function connectionUpdate(update) {
    const { connection, lastDisconnect } = update;
    global['timestamp']['connect'] = new Date();

    if (
      lastDisconnect &&
      lastDisconnect['error'] &&
      lastDisconnect['error']['output'] &&
      lastDisconnect['error']['output']['statusCode'] !== DisconnectReason['loggedOut'] &&
      conn['ws']['readyState'] !== ws['CONNECTING']
    ) {
      console.log(global['reloadHandler'](true));
    }

    if (global['db']['data'] == null) await loadDatabase();
  }

  // ── Cek apakah creds.json rusak ───────────────────────────
  if (
    fs.existsSync('./sessions/creds.json') &&
    !conn['authState']['creds']['registered']
  ) {
    console.log(chalk.yellow('-- WARNING: creds.json is broken, please delete it first --'));
    process.exit(0);
  }

  // ── Pairing code jika belum terdaftar ────────────────────
  if (!conn['authState']['creds']['registered']) {
    let phoneNumber = '';

    do {
      phoneNumber = await question(
        chalk.blueBright('ENTER A VALID NUMBER START WITH REGION CODE. Example : 62xxx:\n')
      );
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 10) {
        console.log(chalk.red('Invalid phone number. Please enter a valid number.'));
      }
    } while (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 10);

    rl.close();
    phoneNumber = phoneNumber.replace(/\D/g, '');

    console.log(chalk.bgWhite(chalk.blue('-- Please wait, generating code... --')));

    setTimeout(async () => {
      const botLabel  = 'LUMINAAA';
      let pairingCode = await conn['requestPairingCode'](phoneNumber, botLabel);

      pairingCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;

      console.log(
        chalk.black(chalk.bgGreen('Your Pairing Code : ')),
        chalk.white(chalk.bgWhite(pairingCode))
      );
    }, 3000);
  }

  // ── Global error handler ──────────────────────────────────
  process.on('uncaughtException', console.error);

  // ── requireWithRetry: load modul dengan retry ─────────────
  const requireWithRetry = (modulePath) => {
    modulePath = require.resolve(modulePath);
    let result;
    let attempts = 0;
    do {
      if (modulePath in require['cache']) delete require['cache'][modulePath];
      result = require(modulePath);
      attempts++;
    } while (
      (Array.isArray(result)
        ? !result.length
        : typeof result === 'object'
        ? !Object.keys(result || {}).length
        : true) &&
      attempts <= 10
    );
    return result;
  };

  // ── reloadHandler: reload handler & buat ulang socket ─────
  let isFirstLoad = true;

  global['reloadHandler'] = function (reconnect) {
    const handler = requireWithRetry('./handler');

    if (reconnect) {
      try {
        global['conn']['ws'].close();
      } catch {}
      global['conn'] = {
        ...global['conn'],
        ...baileysSock['makeWASocket'](socketConfig),
      };
    }

    // Lepas listener lama (kecuali load pertama)
    if (!isFirstLoad) {
      conn['ev'].off('messages.upsert',           conn['handler']);
      conn['ev'].off('group-participants.update', conn['participantsUpdate']);
      conn['ev'].off('message.delete',            conn['delete']);
      conn['ev'].off('connection.update',         conn['connectionUpdate']);
      conn['ev'].off('creds.update',              conn['credsUpdate']);
    }

    // Set pesan selamat datang / tinggal / promosi / demosi
    conn['welcome'] = 'Selamat datang @user di group @subject utamakan baca desk ya \n@desc';
    conn['bye']     = 'Selamat tinggal @user 👋';
    conn['promote'] = '@user sekarang admin!';
    conn['demote']  = '@user sekarang bukan admin!';

    // Bind event handlers
    conn['handler']            = handler['handler'].bind(conn);
    conn['participantsUpdate'] = handler['participantsUpdate'].bind(conn);
    conn['delete']             = handler['delete'].bind(conn);
    conn['connectionUpdate']   = connectionUpdate.bind(conn);
    conn['credsUpdate']        = saveCreds.bind(conn);

    // Daftarkan listener baru
    conn['ev'].on('messages.upsert',           conn['handler']);
    conn['ev'].on('group-participants.update', conn['participantsUpdate']);
    conn['ev'].on('message.delete',            conn['delete']);
    conn['ev'].on('connection.update',         conn['connectionUpdate']);
    conn['ev'].on('creds.update',              conn['credsUpdate']);

    isFirstLoad = false;
    return true;
  };

  // ── Load semua plugins dari folder plugins/ ───────────────
  let pluginsDir = path.join(__dirname, 'plugins');
  let isJsFile   = (filename) => /\.js$/.test(filename);

  global['plugins'] = {};

  (function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name));
      } else if (isJsFile(entry.name)) {
        const fullPath    = path.join(dir, entry.name);
        const relativeKey = path.relative(pluginsDir, fullPath).replace(/\\/g, '/');
        try {
          global['plugins'][relativeKey] = require(fullPath);
        } catch (err) {
          conn['logger'].error(err);
          delete global['plugins'][relativeKey];
        }
      }
    }
  })(pluginsDir);

  console.log('Total plugins: ' + Object.keys(global['plugins']).length);

  // ── reload: fungsi untuk reload satu plugin ───────────────
  global['reload'] = (event, filename) => {
    if (isJsFile(filename)) {
      let pluginPath = path.join(pluginsDir, filename);

      if (pluginPath in require['cache']) {
        delete require['cache'][pluginPath];

        if (fs.existsSync(pluginPath)) {
          conn['logger'].warn("re - require plugin '" + filename + "'");
        } else {
          conn['logger'].warn("deleted plugin '" + filename + "'");
          return delete global['plugins'][filename];
        }
      } else {
        conn['logger'].warn("requiring new plugin '" + filename + "'");
      }

      const syntaxErr = syntaxError(fs.readFileSync(pluginPath), filename);
      if (syntaxErr) {
        conn['logger'].error("syntax error while loading '" + filename + "'\n" + syntaxErr);
      } else {
        try {
          global['plugins'][filename] = require(pluginPath);
        } catch (err) {
          conn['logger'].error(err);
        } finally {
          global['plugins'] = Object.fromEntries(
            Object.entries(global['plugins']).sort(([a], [b]) => a.localeCompare(b))
          );
        }
      }
    }
  };

  Object.freeze(global['reload']);

  fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .forEach((e) => fs.watch(path.join(pluginsDir, e.name), global['reload']));

  // ── Jalankan reloadHandler pertama kali ──────────────────
  global['reloadHandler']();

  // ── Cek ketersediaan tools sistem ────────────────────────
  async function checkSystemTools() {
    let results = await Promise.all(
      [
        childProcess.spawn('ffmpeg'),
        childProcess.spawn('ffprobe'),
        childProcess.spawn('ffmpeg', [
          '-hide_banner', '-loglevel', 'error',
          '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-',
        ]),
        childProcess.spawn('convert'),
        childProcess.spawn('magick'),
        childProcess.spawn('gm'),
        childProcess.spawn('find', ['--version']),
      ].map((proc) => {
        return Promise.race([
          new Promise((resolve) => {
            proc.on('close', (code) => resolve(code !== 127));
          }),
          new Promise((resolve) => {
            proc.on('error', () => resolve(false));
          }),
        ]);
      })
    );

    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = results;
    console.log(results);

    let toolSupport = (global['support'] = {
      ffmpeg,
      ffprobe,
      ffmpegWebp,
      convert,
      magick,
      gm,
      find,
    });

    Object.freeze(global['support']);

    if (!toolSupport['ffmpeg'])
      conn['logger'].warn('Please install ffmpeg for sending videos (pkg install ffmpeg)');

    if (toolSupport['ffmpeg'] && !toolSupport['ffmpegWebp'])
      conn['logger'].warn(
        'Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)'
      );

    if (!toolSupport['convert'] && !toolSupport['magick'] && !toolSupport['gm'])
      conn['logger'].warn(
        'Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)'
      );
  }

  checkSystemTools()
    .then(() => conn['logger'].warn('Quick Test Done'))
    .catch('support');

})();
