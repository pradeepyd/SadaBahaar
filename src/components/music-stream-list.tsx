"use client"

import { useState } from "react"
import { MusicStream } from "@/components/music-stream"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for music streams
const mockStreams = [
  {
    id: "1",
    title: "Summer Vibes Mix",
    artist: "DJ Sunshine",
    genre: "Electronic",
    coverImage: "/placeholder.svg?height=300&width=300",
    upvotes: 245,
    duration: "3:45",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    title: "Late Night Jazz Session",
    artist: "The Smooth Quartet",
    genre: "Jazz",
    coverImage: "/placeholder.svg?height=300&width=300",
    upvotes: 189,
    duration: "5:12",
    createdAt: "5 days ago",
  },
  {
    id: "3",
    title: "Hip Hop Beats Vol. 3",
    artist: "BeatMaster Pro",
    genre: "Hip Hop",
    coverImage: "/placeholder.svg?height=300&width=300",
    upvotes: 312,
    duration: "4:20",
    createdAt: "1 day ago",
  },
  // Add more mock streams as needed
]

export function MusicStreamList() {
  const [streams, setStreams] = useState(mockStreams)

  const handleUpvote = (id: string) => {
    setStreams(streams.map((stream) => (stream.id === id ? { ...stream, upvotes: stream.upvotes + 1 } : stream)))
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
              <MusicStream key={stream.id} stream={stream} onUpvote={handleUpvote} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="newest" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...streams]
              .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
              .map((stream) => (
                <MusicStream key={stream.id} stream={stream} onUpvote={handleUpvote} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...streams]
              .sort((a, b) => b.upvotes - a.upvotes)
              .map((stream) => (
                <MusicStream key={stream.id} stream={stream} onUpvote={handleUpvote} />
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

