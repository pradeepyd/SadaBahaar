import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  upvotes: number
  downvotes: number
  thumbnail?: string
}

interface SongQueueProps {
  songs: Song[]
  onUpvote: (id: string) => void
  onDownvote: (id: string) => void
}

export function SongQueue({ songs, onUpvote, onDownvote }: SongQueueProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">♪</span>
          Song Queue
        </h2>
      </div>
      {songs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No songs in queue</p>
      ) : (
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)] lg:max-h-[calc(100vh-10rem)]">
          {songs.map((song) => (
            <li key={song.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image src={song.thumbnail || "/placeholder.svg"} alt="" fill className="object-cover rounded" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate text-gray-800 dark:text-white">{song.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                <div className="flex items-center gap-4 mt-1">
                  <button
                    onClick={() => onUpvote(song.id)}
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{song.upvotes}</span>
                  </button>
                  <button
                    onClick={() => onDownvote(song.id)}
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">{song.downvotes}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

