import Image from "next/image"
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { differenceInSeconds, addMinutes } from 'date-fns';

interface Stream {
  id: string;
  title: string;
  extractedId: string;
  upvotes: number;
  downvotes: number;
  thumbnail?: string;
  haveUpvoted: boolean;
  haveDownvoted: boolean;
  url: string;
  type: string;
  lastPlayedAt?: string;
}

interface SongQueueProps {
  songs: Stream[] 
  onUpvote: (id: string) => void
  onDownvote: (id: string) => void
  currentSongId?: string
  onSelectSong?: (song: Stream) => void
  roomId: string
}

export function SongQueue({ songs = [], onUpvote, onDownvote, currentSongId, onSelectSong, roomId }: SongQueueProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [loadingVoteId, setLoadingVoteId] = useState<string | null>(null);
  const [loadingVoteType, setLoadingVoteType] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Wrap the upvote/downvote handlers to show loader
  const handleUpvote = async (id: string, alreadyUpvoted: boolean) => {
    setLoadingVoteId(id);
    setLoadingVoteType('up');
    if (alreadyUpvoted) {
      // Withdraw upvote
      await fetch('/api/streams/upvote', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId: id, roomId })
      });
    } else {
      await Promise.resolve(onUpvote(id));
    }
    setLoadingVoteId(null);
    setLoadingVoteType(null);
  };
  const handleDownvote = async (id: string, alreadyDownvoted: boolean) => {
    setLoadingVoteId(id);
    setLoadingVoteType('down');
    if (alreadyDownvoted) {
      // Withdraw downvote
      await fetch('/api/streams/downvote', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId: id, roomId })
      });
    } else {
      await Promise.resolve(onDownvote(id));
    }
    setLoadingVoteId(null);
    setLoadingVoteType(null);
  };

  return (
    <div className="bg-[#faf6fe] dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">♪</span>
          Song Queue
        </h2>
      </div>
      {songs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No songs in queue</p>
      ) : (
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)] lg:max-h-[calc(100vh-14rem)]">
          {songs.map((song: Stream) => {
            // Timer logic
            let cooldown = 0;
            let cooldownStr = "";
            if (song.lastPlayedAt) {
              const lastPlayed = new Date(song.lastPlayedAt);
              const availableAt = addMinutes(lastPlayed, 5);
              cooldown = Math.max(0, differenceInSeconds(availableAt, now));
              if (cooldown > 0) {
                const min = Math.floor(cooldown / 60);
                const sec = cooldown % 60;
                cooldownStr = `${min}:${sec.toString().padStart(2, '0')}`;
              }
            }
            const isAvailable = cooldown === 0;
            return (
              <li
                key={song.id}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-gray-900 ${song.id === currentSongId ? 'border-2 border-purple-600 bg-purple-50 dark:bg-purple-900' : 'bg-neutral-100 dark:bg-gray-700'}`}
                style={{ cursor: isAvailable ? 'pointer' : 'not-allowed', opacity: isAvailable ? 1 : 0.6 }}
                onClick={() => isAvailable && onSelectSong?.(song)}
              >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image src={song.thumbnail || "/placeholder.svg"} alt="" fill className="object-cover rounded" />
              </div>
              <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate text-gray-800 dark:text-white flex items-center gap-2">
                    {song.title}
                    {song.id === currentSongId && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-purple-600 text-white animate-pulse">Now Playing</span>
                    )}
                    {!isAvailable && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-400 text-white">Available in {cooldownStr}</span>
                    )}
                  </h3>
                {/* <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.artist}</p> */}
                <div className="flex items-center gap-4 mt-1">
                  <button
                      onClick={e => { e.stopPropagation(); if (isAvailable) handleUpvote(song.id, song.haveUpvoted); }}
                      className={`flex items-center gap-1 ${
                        song.haveUpvoted 
                          ? "text-purple-600 dark:text-purple-400" 
                          : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                      disabled={loadingVoteId === song.id && loadingVoteType === 'up'}
                  >
                    {loadingVoteId === song.id && loadingVoteType === 'up'
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <ThumbsUp className="h-4 w-4" />}
                    <span className="text-sm">{song.upvotes}</span>
                  </button>
                  <button
                      onClick={e => { e.stopPropagation(); if (isAvailable) handleDownvote(song.id, song.haveDownvoted); }}
                      className={`flex items-center gap-1 ${
                        song.haveDownvoted 
                          ? "text-red-600 dark:text-red-400" 
                          : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      }`}
                      disabled={loadingVoteId === song.id && loadingVoteType === 'down'}
                  >
                    {loadingVoteId === song.id && loadingVoteType === 'down'
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <ThumbsDown className="h-4 w-4" />}
                    <span className="text-sm">{song.downvotes}</span>
                  </button>
                    {isAvailable && (
                      <button
                        className="ml-2 px-2 py-0.5 text-xs rounded bg-green-600 text-white"
                        onClick={e => { e.stopPropagation(); onSelectSong?.(song); }}
                      >
                        Play
                      </button>
                    )}
                </div>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}

