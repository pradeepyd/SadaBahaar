"use client"

import Image from "next/image"
import { Play, Pause, ChevronUp, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MusicStreamProps {
  stream: {
    id: string
    title: string
    artist: string
    genre: string
    coverImage: string
    upvotes: number
    duration: string
    createdAt: string
  }
  onUpvote: (id: string) => void
}

export function MusicStream({ stream, onUpvote }: MusicStreamProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleUpvote = () => {
    if (!hasUpvoted) {
      onUpvote(stream.id)
      setHasUpvoted(true)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image src={stream.coverImage || "/placeholder.svg"} alt={stream.title} fill className="object-cover" />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground">{stream.artist}</p>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{stream.genre}</Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 px-2 ${hasUpvoted ? "text-primary" : ""}`}
                  onClick={handleUpvote}
                  disabled={hasUpvoted}
                >
                  <ChevronUp className="h-4 w-4" />
                  <span>{stream.upvotes}</span>
                </Button>
                <span className="text-xs text-muted-foreground">{stream.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

