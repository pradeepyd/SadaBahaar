"use client"

import Image from "next/image"
import { Play, Pause, ChevronUp, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MusicStreamProps {
  stream: {
    id: string
    title: string
    artist?: string
    genre?: string
    coverImage?: string
    upvotes: number
    duration?: string
    createdAt: string
    haveUpvoted: boolean
    haveDownvoted: boolean
  }
  onUpvote: (id: string) => Promise<void>
  onUpvoteDouble?: (id: string) => Promise<void>
  onDownvote?: (id: string) => Promise<void>
  onDownvoteDouble?: (id: string) => Promise<void>
  loadingVote?: 'up' | 'down' | null
  haveUpvoted?: boolean
  haveDownvoted?: boolean
}

export function MusicStream({ stream, onUpvote, onUpvoteDouble, onDownvote, onDownvoteDouble, loadingVote, haveUpvoted, haveDownvoted }: MusicStreamProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Single click: upvote if not already upvoted
  const handleUpvote = async () => {
    if (onUpvote) await onUpvote(stream.id)
  }
  // Double click: remove upvote
  const handleUpvoteDouble = async () => {
    if (onUpvoteDouble) await onUpvoteDouble(stream.id)
  }
  // Single click: downvote if not already downvoted
  const handleDownvote = async () => {
    if (onDownvote) await onDownvote(stream.id)
  }
  // Double click: remove downvote
  const handleDownvoteDouble = async () => {
    if (onDownvoteDouble) await onDownvoteDouble(stream.id)
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
                  className={`flex items-center gap-1 px-2 ${haveUpvoted ? "text-primary" : ""}`}
                  onClick={handleUpvote}
                  onDoubleClick={handleUpvoteDouble}
                  disabled={loadingVote === 'up'}
                >
                  {loadingVote === 'up' ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <ChevronUp className="h-4 w-4" />}
                  <span>{stream.upvotes}</span>
                </Button>
                {/* Downvote button */}
                {onDownvote && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 px-2 ${haveDownvoted ? "text-red-500" : ""}`}
                    onClick={handleDownvote}
                    onDoubleClick={handleDownvoteDouble}
                    disabled={loadingVote === 'down'}
                  >
                    {loadingVote === 'down' ? <Loader2 className="h-6 w-6 animate-spin text-red-500" /> : <span style={{ fontSize: 18, lineHeight: 1 }}>👎</span>}
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">{stream.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {/* Debug: Show full stream object */}
      <pre style={{ fontSize: 10, background: '#222', color: '#fff', padding: 8, margin: 0, borderRadius: 4 }}>
        {JSON.stringify(stream, null, 2)}
      </pre>
    </Card>
  )
}

