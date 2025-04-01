import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from './websocket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

export async function initializeServer() {
  try {
    await app.prepare();
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });

    WebSocketServer.initialize(server);

    server.listen(3001, () => {
      console.log('> Ready on http://localhost:3001');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}