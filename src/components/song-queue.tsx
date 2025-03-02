import Image from "next/image"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Song {
  id: string
  title: string
  artist: string
  youtubeId: string
  upvotes: number
  downvotes: number
  thumbnail?: string
}

interface SongQueueProps {
  songs: Song[]
  onUpvote: (id: string) => void
  onDownvote: (id: string) => void
  onPlay: (song: Song) => void
}

export function SongQueue({ songs, onUpvote, onDownvote, onPlay }: SongQueueProps) {
  const sortedSongs = [...songs].sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))

  if (sortedSongs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No songs in queue</div>
  }

  return (
    <div className="space-y-4">
      {sortedSongs.map((song) => (
        <div
          key={song.id}
          className="flex items-center gap-4 group hover:bg-accent/50 rounded-lg p-2 transition-colors"
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={song.thumbnail || "/placeholder.svg"} alt="" fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{song.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => onUpvote(song.id)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium">{song.upvotes - song.downvotes}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => onDownvote(song.id)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onPlay(song)}
            >
              Play
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

