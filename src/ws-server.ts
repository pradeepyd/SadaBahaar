// Use CommonJS require, not import
const { WebSocketServer } = require('ws');

let wss: any;
if (require.main === module) {
  wss = new WebSocketServer({ port: 3001 });
  wss.on('connection', (ws: any) => {
    ws.on('message', (message: any) => {
      // Handle incoming messages if needed
    });
  });
  console.log('WebSocket server running on ws://localhost:3001');
}

function broadcastToAll(data: any) {
  if (!wss) return;
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { broadcastToAll }; 