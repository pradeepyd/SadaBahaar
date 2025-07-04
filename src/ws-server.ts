// Use CommonJS require, not import
import { WebSocketServer, WebSocket } from 'ws';
import { pathToFileURL } from "url";

let wss: WebSocketServer | undefined;
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  wss = new WebSocketServer({ port: 3001 });
  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', () => {
      // Handle incoming messages if needed
    });
  });
}

function broadcastToAll(data: unknown) {
  if (!wss) return;
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

export { broadcastToAll }; 