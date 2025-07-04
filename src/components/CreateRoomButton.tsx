"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateRoomButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Room' })
      });
      const data = await res.json();
      if (res.ok && data.id) {
        router.push(`/room/${data.id}`);
      } else {
        setError(data.error || 'Failed to create room');
      }
    } catch {
      setError('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button onClick={handleCreate} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded">
        {loading ? 'Creating...' : 'Create Room'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 