"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToAll = broadcastToAll;
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Root endpoint for status
app.get('/', (_req, res) => {
    res.status(200).send('WebSocket server is running');
});
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});
// Broadcast endpoint
app.post('/broadcast', (req, res) => {
    broadcastToAll(req.body);
    res.sendStatus(200);
});
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (ws) => {
    ws.on('message', () => {
        // Handle incoming messages if needed
    });
});
function broadcastToAll(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
}
server.listen(PORT);
