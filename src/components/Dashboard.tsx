"use client"

import { useState } from "react"
 import { Music, Share2, SkipForward } from "lucide-react"
import { YouTubeEmbed } from "@/components/youtube-embed"
import { SongQueue } from "@/components/song-queue"
import { AddStreamForm } from "@/components/add-stream-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Song {
  id: string
  title: string
  artist: string
  youtubeId: string
  upvotes: number
  downvotes: number
  thumbnail?: string
}

const initialSongs: Song[] = [
  {
    id: "1",
    title: "Summertime Sadness",
    artist: "Lana Del Rey",
    youtubeId: "TdrL3QxjyVw",
    upvotes: 15,
    downvotes: 2,
    thumbnail: "https://i.ytimg.com/vi/TdrL3QxjyVw/hqdefault.jpg",
  },
  {
    id: "2",
    title: "Mitran Di Chhatri",
    artist: "Babbu Maan",
    youtubeId: "vqRWMDv0r78",
    upvotes: 10,
    downvotes: 1,
    thumbnail: "https://i.ytimg.com/vi/vqRWMDv0r78/hqdefault.jpg",
  },
  {
    id: "3",
    title: "For Whom The Bell Tolls",
    artist: "Metallica",
    youtubeId: "eeqGuaAl6Ic",
    upvotes: 20,
    downvotes: 3,
    thumbnail: "https://i.ytimg.com/vi/eeqGuaAl6Ic/hqdefault.jpg",
  },
  {
    id: "4",
    title: "Stairway To Heaven",
    artist: "Led Zeppelin",
    youtubeId: "QkF3oxziUI4",
    upvotes: 25,
    downvotes: 1,
    thumbnail: "https://i.ytimg.com/vi/QkF3oxziUI4/hqdefault.jpg",
  },
  {
    id: "5",
    title: "Toh Phir Aao",
    artist: "Mustafa Zahid",
    youtubeId: "D8XFTgJSleA",
    upvotes: 12,
    downvotes: 2,
    thumbnail: "https://i.ytimg.com/vi/D8XFTgJSleA/hqdefault.jpg",
  },
]

export function CreatorDashboard() {
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  const addSong = (youtubeId: string, title: string, artist: string, thumbnail?: string) => {
    const newSong: Song = {
      id: Date.now().toString(),
      title,
      artist,
      youtubeId,
      upvotes: 0,
      downvotes: 0,
      thumbnail,
    }
    setSongs((prevSongs) => [...prevSongs, newSong])
    if (!currentSong) {
      setCurrentSong(newSong)
    }
  }

  const upvoteSong = (id: string) => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === id ? { ...song, upvotes: song.upvotes + 1 } : song)))
  }

  const downvoteSong = (id: string) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) => (song.id === id ? { ...song, downvotes: song.downvotes + 1 } : song)),
    )
  }

  const playNext = () => {
    if (songs.length > 0) {
      const nextSong = songs[0]
      setCurrentSong(nextSong)
      setSongs((prevSongs) => prevSongs.slice(1))
    } else {
      setCurrentSong(null)
    }
  }

  const playSong = (song: Song) => {
    const songIndex = songs.findIndex((s) => s.id === song.id)
    if (songIndex !== -1) {
      setCurrentSong(song)
      setSongs((prevSongs) => [...prevSongs.slice(0, songIndex), ...prevSongs.slice(songIndex + 1)])
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Now Playing</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Stream</DialogTitle>
                  <DialogDescription>Share this link with others to let them join your stream</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input readOnly value={shareUrl} onClick={(e) => e.currentTarget.select()} />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {currentSong ? (
            <>
              <YouTubeEmbed youtubeId={currentSong.youtubeId} onEnded={playNext} />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{currentSong.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
                  </div>
                  <Button variant="secondary" size="sm" className="gap-2" onClick={playNext}>
                    <SkipForward className="h-4 w-4" />
                    Play Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="aspect-video bg-accent/50 rounded-lg flex flex-col items-center justify-center space-y-4">
              <p className="text-muted-foreground">No song currently playing</p>
              <Button variant="secondary" size="sm" className="gap-2" onClick={playNext} disabled={songs.length === 0}>
                <SkipForward className="h-4 w-4" />
                Play Next
              </Button>
            </div>
          )} 
        </div>
      </div>
       <div className="space-y-6">
        <AddStreamForm onAddSong={addSong} />
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Song Queue</h2>
          </div>
          <SongQueue songs={songs} onUpvote={upvoteSong} onDownvote={downvoteSong} onPlay={playSong} />
        </div>
      </div>
    </div>
  )
}

