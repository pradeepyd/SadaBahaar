"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MusicStream } from "@/components/music-stream"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Stream {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  coverImage?: string;
  upvotes: number;
  duration?: string;
  createdAt: string;
  haveUpvoted: boolean;
  haveDownvoted: boolean;
}

interface MusicStreamListProps {
  roomId: string;
}

export function MusicStreamList({ roomId }: MusicStreamListProps) {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loadingVoteId, setLoadingVoteId] = useState<string | null>(null)
  const [loadingVoteType, setLoadingVoteType] = useState<'up' | 'down' | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Fetch streams from backend
  const fetchStreams = useCallback(async () => {
    try {
      console.log('Refetching streams');
      const res = await fetch(`/api/streams?roomId=${roomId}`, { cache: 'no-store' });
      const data = await res.json();
      setStreams(data.streams || [])
      console.log('Fetched streams:', data.streams)
    } catch {
      // Error handled silently
    }
  }, [roomId]);

  useEffect(() => {
    fetchStreams()
  }, [roomId, fetchStreams])

  // Listen for WebSocket messages and refetch on relevant events
  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const ws = new window.WebSocket(WS_URL)
    wsRef.current = ws
    ws.onmessage = (event) => {
      try {
        console.log('WebSocket message received:', event.data);
        const msg = JSON.parse(event.data)
        if (msg.type === 'queue' || msg.type === 'vote') {
          fetchStreams()
        }
      } catch {
        // Ignore non-JSON messages
      }
    }
    return () => {
      ws.close()
    }
  }, [roomId, fetchStreams])

  const handleUpvote = async (id: string) => {
    if (!roomId) return;
    setLoadingVoteId(id)
    setLoadingVoteType('up')
    try {
      await Promise.all([
        fetch('/api/streams/upvote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streamId: id, roomId })
        }),
        new Promise(res => setTimeout(res, 500)) // minimum spinner duration
      ])
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
    setLoadingVoteId(null)
    setLoadingVoteType(null)
  }

  const handleDownvote = async (id: string) => {
    if (!roomId) return;
    setLoadingVoteId(id)
    setLoadingVoteType('down')
    try {
      await Promise.all([
        fetch('/api/streams/downvote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streamId: id, roomId })
        }),
        new Promise(res => setTimeout(res, 500)) // minimum spinner duration
      ])
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
    setLoadingVoteId(null)
    setLoadingVoteType(null)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="popular">Most Upvoted</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streams.map((stream) => (
              <MusicStream
                key={stream.id}
                stream={stream}
                onUpvote={async (id) => {
                  if (!stream.haveUpvoted) {
                    setLoadingVoteId(id)
                    setLoadingVoteType('up')
                    await handleUpvote(id)
                    await new Promise(res => setTimeout(res, 500))
                    await fetchStreams()
                    setLoadingVoteId(null)
                    setLoadingVoteType(null)
                  }
                }}
                onUpvoteDouble={async (id) => {
                  if (stream.haveUpvoted) {
                    setLoadingVoteId(id)
                    setLoadingVoteType('up')
                    await fetch('/api/streams/upvote', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ streamId: id, roomId })
                    })
                    await new Promise(res => setTimeout(res, 500))
                    await fetchStreams()
                    setLoadingVoteId(null)
                    setLoadingVoteType(null)
                  }
                }}
                onDownvote={async (id) => {
                  if (!stream.haveDownvoted) {
                    setLoadingVoteId(id)
                    setLoadingVoteType('down')
                    await handleDownvote(id)
                    await new Promise(res => setTimeout(res, 500))
                    await fetchStreams()
                    setLoadingVoteId(null)
                    setLoadingVoteType(null)
                  }
                }}
                onDownvoteDouble={async (id) => {
                  if (stream.haveDownvoted) {
                    setLoadingVoteId(id)
                    setLoadingVoteType('down')
                    await fetch('/api/streams/downvote', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ streamId: id, roomId })
                    })
                    await new Promise(res => setTimeout(res, 500))
                    await fetchStreams()
                    setLoadingVoteId(null)
                    setLoadingVoteType(null)
                  }
                }}
                loadingVote={loadingVoteId === stream.id ? loadingVoteType : null}
                haveUpvoted={stream.haveUpvoted}
                haveDownvoted={stream.haveDownvoted}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="newest" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...streams]
              .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
              .map((stream) => (
                <MusicStream key={stream.id} stream={stream} onUpvote={handleUpvote} onDownvote={handleDownvote} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...streams]
              .sort((a, b) => b.upvotes - a.upvotes)
              .map((stream) => (
                <MusicStream key={stream.id} stream={stream} onUpvote={handleUpvote} onDownvote={handleDownvote} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Follow creators to see their streams here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

