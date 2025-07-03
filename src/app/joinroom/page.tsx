"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoomPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let roomId = input.trim();
    // If user pasted a full link, extract the roomId
    const match = roomId.match(/room\/(\w+)/);
    if (match) roomId = match[1];
    if (!roomId) {
      setError('Please enter a valid room ID or link');
      return;
    }
    router.push(`/room/${roomId}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Join a Room</h1>
      <form onSubmit={handleJoin} className="flex flex-col items-center gap-4">
        <input
          className="border px-3 py-2 rounded w-72"
          type="text"
          placeholder="Enter room ID or paste link"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Join Room</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </main>
  );
} 