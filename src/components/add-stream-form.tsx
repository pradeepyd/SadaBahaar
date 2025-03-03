"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddStreamFormProps {
  onAddSong: (youtubeId: string, title: string, artist: string, thumbnail?: string) => void
}

export function AddStreamForm({ onAddSong }: AddStreamFormProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Functionality removed as per request
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
        <Plus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        Add Stream
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Add
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Paste a YouTube video URL to add to your stream queue
        </p>
      </form>
    </div>
  )
}

