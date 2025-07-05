import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://fanmix-zeta.vercel.app"
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

// Root endpoint for status
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('WebSocket server is running');
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Broadcast endpoint
app.post('/broadcast', (req: Request, res: Response) => {
  broadcastToAll(req.body);
  res.sendStatus(200);
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', () => {
    // Handle incoming messages if needed
  });
});

export function broadcastToAll(data: unknown) {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

server.listen(PORT); 