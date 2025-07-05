import React, { useEffect, useRef, useState } from 'react';

const WS_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL
  ? process.env.NEXT_PUBLIC_WS_URL
  : 'ws://localhost:3001';

const WebSocketTest: React.FC = () => {
  const [status, setStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new window.WebSocket(WS_URL);
    wsRef.current = ws;
    setStatus('Connecting...');

    ws.onopen = () => setStatus('Connected');
    ws.onclose = () => setStatus('Disconnected');
    ws.onerror = () => setStatus('Error');
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(input || 'Hello from Next.js!');
      setInput('');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <h3>WebSocket Test</h3>
      <div>Status: <b>{status}</b></div>
      <div style={{ margin: '8px 0' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={status !== 'Connected'} style={{ marginLeft: 8 }}>
          Send
        </button>
      </div>
      <div>
        <b>Received messages:</b>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketTest; 