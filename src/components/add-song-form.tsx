"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddSongFormProps {
  onAddSong: (youtubeId: string, title: string) => void
}

export function AddSongForm({ onAddSong }: AddSongFormProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const youtubeId = extractYoutubeId(youtubeUrl)
    if (youtubeId && title) {
      onAddSong(youtubeId, title)
      setYoutubeUrl("")
      setTitle("")
    }
  }

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <Input
        type="text"
        placeholder="YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        required
      />
      <Input type="text" placeholder="Song Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Button type="submit">Add Song</Button>
    </form>
  )
}

