import { spawn }        from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path              from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir    = path.join(__dirname, '../screenshots');
mkdirSync(outDir, { recursive: true });

const CHROME   = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE     = 'http://localhost:4322';
const DBG_PORT = 9223;

const sections = [
  { name: 'hero',         selector: 'body'          },
  { name: 'menu',         selector: '#menu'         },
  { name: 'gallery',      selector: '#gallery'      },
  { name: 'story',        selector: '#story'        },
  { name: 'testimonials', selector: '#testimonials' },
  { name: 'reservation',  selector: '#reservation'  },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getDebuggerUrl(retries = 25) {
  for (let i = 0; i < retries; i++) {
    try {
      const res  = await fetch(`http://localhost:${DBG_PORT}/json/list`);
      const tabs = await res.json();
      const tab  = tabs.find(t => t.type === 'page');
      if (tab?.webSocketDebuggerUrl) return tab.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error('Chrome debugger did not start');
}

function makeCdp(ws) {
  let cmdId = 0;
  const pending  = new Map();   // id → { resolve, reject }
  const handlers = new Map();   // event method → [cb, ...]

  ws.addEventListener('message', ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id !== undefined) {
      // command response
      const p = pending.get(msg.id);
      if (p) {
        pending.delete(msg.id);
        msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
      }
    } else if (msg.method) {
      // event
      const cbs = handlers.get(msg.method) ?? [];
      cbs.forEach(cb => cb(msg.params));
    }
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++cmdId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const once = (event) =>
    new Promise(resolve => {
      const list = handlers.get(event) ?? [];
      const cb = (params) => {
        handlers.set(event, (handlers.get(event) ?? []).filter(f => f !== cb));
        resolve(params);
      };
      handlers.set(event, [...list, cb]);
    });

  return { send, once };
}

// ── main ──────────────────────────────────────────────────────────────
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${DBG_PORT}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  '--no-sandbox',
  'about:blank',
], { stdio: 'ignore' });

try {
  const wsUrl = await getDebuggerUrl();
  const ws    = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open',  res);
    ws.addEventListener('error', rej);
  });

  const { send, once } = makeCdp(ws);

  await send('Page.enable');

  // Navigate and wait for load event
  const loadPromise = once('Page.loadEventFired');
  await send('Page.navigate', { url: BASE });
  await loadPromise;
  await sleep(2000); // let animations & lazy images settle

  for (const { name, selector } of sections) {
    await send('Runtime.evaluate', {
      expression: `
        (function() {
          const el = document.querySelector('${selector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })();
      `,
    });
    await sleep(700);

    const { data } = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(data, 'base64'));
    console.log(`✓  ${name}.png`);
  }

  ws.close();
  console.log('\nDone →', outDir);
} finally {
  chrome.kill();
}
