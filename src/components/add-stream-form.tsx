"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddStreamFormProps {
  onAddSong: (youtubeId: string, title: string, artist: string, thumbnail?: string) => void
}

export function AddStreamForm({ onAddSong }: AddStreamFormProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const youtubeId = extractYoutubeId(youtubeUrl)
    if (youtubeId && title && artist) {
      const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      onAddSong(youtubeId, title, artist, thumbnail)
      setYoutubeUrl("")
      setTitle("")
      setArtist("")
    }
  }

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add Stream
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Add Song
          </Button>
          <p className="text-sm text-muted-foreground">
            Paste a YouTube video URL and provide song details to add to your stream queue
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

