"use client"

import { useEffect, useRef } from "react"
import YouTube from "react-youtube"

interface YouTubeEmbedProps {
  youtubeId: string
  onEnded: () => void
}

export function YouTubeEmbed({ youtubeId, onEnded }: YouTubeEmbedProps) {
  const playerRef = useRef<YouTube>(null)

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.addEventListener("onStateChange", (event: { data: number }) => {
        if (event.data === YouTube.PlayerState.ENDED) {
          onEnded()
        }
      })
    }
  }, [onEnded])

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <YouTube
        ref={playerRef}
        videoId={youtubeId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
        className="w-full h-full"
      />
    </div>
  )
}

