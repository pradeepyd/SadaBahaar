"use client"

import { useEffect, useRef, useState } from "react"
import YouTube from "react-youtube"

interface YouTubeEmbedProps {
  youtubeId: string
  onEnded: () => void
  isPlaying?: boolean
  startSeconds?: number // NEW: for playback sync
}

export function YouTubeEmbed({ youtubeId, onEnded, isPlaying = true, startSeconds }: YouTubeEmbedProps) {
  const playerRef = useRef<YouTube>(null)
  const ytPlayer = useRef<YT.Player | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  const handleReady = (event: YT.PlayerEvent) => {
    ytPlayer.current = event.target;
    setPlayerReady(true);
    // Seek to startSeconds if provided
    if (typeof startSeconds === 'number' && startSeconds > 0) {
      event.target.seekTo(startSeconds, true);
    }
    // Always try to play when ready
    event.target.playVideo();
  };

  // Force play when startSeconds changes (e.g., after refresh or join)
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (
      playerReady &&
      ytPlayer.current &&
      typeof ytPlayer.current.seekTo === 'function' &&
      typeof ytPlayer.current.playVideo === 'function'
    ) {
      timeout = setTimeout(() => {
        try {
          if (
            ytPlayer.current &&
            typeof startSeconds === 'number' &&
            startSeconds > 0
          ) {
            ytPlayer.current.seekTo(startSeconds, true);
          }
          if (ytPlayer.current) {
            ytPlayer.current.playVideo();
          }
        } catch (err) {
          console.error('YouTube player error:', err);
        }
      }, 100); // 100ms delay
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [startSeconds, playerReady]);

  // Control playback
  useEffect(() => {
    if (playerReady && playerRef.current && playerRef.current.internalPlayer) {
      playerRef.current.internalPlayer.getPlayerState().then((state: number) => {
        if (isPlaying && state !== 1) {
          playerRef.current?.internalPlayer.playVideo();
        } else if (!isPlaying && state === 1) {
          playerRef.current?.internalPlayer.pauseVideo();
        }
      });
    }
  }, [isPlaying, playerReady]);

  // Auto-play when youtubeId changes and isPlaying is true
  useEffect(() => {
    if (playerReady && playerRef.current && playerRef.current.internalPlayer && isPlaying) {
      playerRef.current.internalPlayer.playVideo();
    }
  }, [youtubeId, isPlaying, playerReady]);

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <YouTube
        key={youtubeId}
        ref={playerRef}
        videoId={youtubeId}
        onReady={handleReady}
        onEnd={onEnded}
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

