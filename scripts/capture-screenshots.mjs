import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'evidence');
const chromePath = process.env.CHROME_BIN
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const pageUrl = process.env.PAGE_URL || 'http://localhost:5174/';
const widths = [320, 390, 768, 1200, 1440];

async function getFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitForDebugger(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) return response.json();
    } catch (error) {
      if (attempt === 49) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Chrome DevTools endpoint did not become available.');
}

function connectToPage(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    let nextId = 0;
    const pending = new Map();

    socket.addEventListener('open', () => {
      function send(method, params = {}) {
        const id = nextId + 1;
        nextId = id;
        return new Promise((sendResolve, sendReject) => {
          pending.set(id, { resolve: sendResolve, reject: sendReject });
          socket.send(JSON.stringify({ id, method, params }));
        });
      }

      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (!message.id || !pending.has(message.id)) return;
        const handlers = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) handlers.reject(new Error(message.error.message));
        else handlers.resolve(message.result);
      });

      resolve({ socket, send });
    });
    socket.addEventListener('error', reject, { once: true });
  });
}

function waitForLoad(socket) {
  return new Promise((resolve) => {
    function handleMessage(event) {
      const message = JSON.parse(event.data);
      if (message.method !== 'Page.loadEventFired') return;
      socket.removeEventListener('message', handleMessage);
      resolve();
    }
    socket.addEventListener('message', handleMessage);
  });
}

await mkdir(outputDirectory, { recursive: true });
const port = await getFreePort();
const userDataDirectory = path.join(os.tmpdir(), `havenarc-chrome-${process.pid}`);
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-allow-origins=*',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDirectory}`,
  'about:blank',
], { stdio: 'ignore', windowsHide: true });

try {
  const targets = await waitForDebugger(port);
  const page = targets.find((target) => target.type === 'page');
  if (!page) throw new Error('Chrome did not expose a page target.');

  const { socket, send } = await connectToPage(page.webSocketDebuggerUrl);
  await send('Page.enable');
  await send('Runtime.enable');
  const results = [];

  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 760,
    });
    const load = waitForLoad(socket);
    await send('Page.navigate', { url: pageUrl });
    await load;

    const metrics = await send('Runtime.evaluate', {
      expression: `(${async () => {
        for (let attempt = 0; attempt < 50; attempt += 1) {
          if (document.querySelectorAll('#properties article').length === 6) break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        await Promise.all([...document.images].map((image) => {
          image.loading = 'eager';
          return image.decode().catch(() => null);
        }));
        return {
          viewport: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          cards: document.querySelectorAll('#properties article').length,
          imageFailures: [...document.images]
            .filter((image) => image.naturalWidth === 0)
            .map((image) => image.currentSrc),
        };
      }})()`,
      awaitPromise: true,
      returnByValue: true,
    });
    const dimensions = metrics.result.value;
    if (width === 320) {
      await send('Runtime.evaluate', {
        expression: 'document.querySelector("header button").focus()',
      });
      await send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Enter',
        code: 'Enter',
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13,
        text: '\r',
        unmodifiedText: '\r',
      });
      await send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Enter',
        code: 'Enter',
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13,
      });
      const menuOpened = await send('Runtime.evaluate', {
        expression: 'document.querySelector("header button").getAttribute("aria-expanded")',
        returnByValue: true,
      });
      await send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Escape',
        code: 'Escape',
        windowsVirtualKeyCode: 27,
        nativeVirtualKeyCode: 27,
      });
      await send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Escape',
        code: 'Escape',
        windowsVirtualKeyCode: 27,
        nativeVirtualKeyCode: 27,
      });
      const menuClosed = await send('Runtime.evaluate', {
        expression: '({expanded:document.querySelector("header button").getAttribute("aria-expanded"),focusReturned:document.activeElement===document.querySelector("header button")})',
        returnByValue: true,
      });
      dimensions.mobileMenu = {
        opensWithEnter: menuOpened.result.value === 'true',
        closesWithEscape: menuClosed.result.value.expanded === 'false',
        returnsFocus: menuClosed.result.value.focusReturned,
      };
    }
    const layout = await send('Page.getLayoutMetrics');
    const contentSize = layout.cssContentSize || layout.contentSize;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width,
        height: contentSize.height,
        scale: 1,
      },
    });
    const screenshotPath = path.join(outputDirectory, `${width}px.png`);
    await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    results.push({ ...dimensions, screenshot: path.relative(root, screenshotPath) });
  }

  socket.close();
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
} finally {
  chrome.kill();
}
