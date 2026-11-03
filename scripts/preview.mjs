import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('.output/public');
const base = '/veyli-colour-nuxt';
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    if (pathname === '/') {
      response.writeHead(302, { location: base + '/' });
      response.end();
      return;
    }
    if (pathname !== base && !pathname.startsWith(base + '/')) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    let file = resolve(root, '.' + (pathname.slice(base.length) || '/'));
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(400);
      response.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    } catch {
      file = resolve(root, '404.html');
      response.statusCode = 404;
    }
    let body;
    try {
      body = await readFile(file);
    } catch {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.setHeader(
      'Content-Type',
      types[extname(file)] || 'application/octet-stream',
    );
    response.end(body);
  } catch {
    response.writeHead(400);
    response.end('Invalid request');
  }
});
server.listen(4204, '127.0.0.1', () =>
  console.log('Veyli preview: http://127.0.0.1:4204/veyli-colour-nuxt/'),
);
