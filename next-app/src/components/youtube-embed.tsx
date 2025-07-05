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
  console.log('YouTubeEmbed youtubeId:', youtubeId);
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
            console.log('Calling playVideo (startSeconds effect)', { youtubeId, playerReady, ytPlayer: ytPlayer.current });
            ytPlayer.current.playVideo();
          }
        } catch (err) {
          console.error('YouTube player error:', err, 'youtubeId:', youtubeId, 'playerReady:', playerReady, 'ytPlayer:', ytPlayer.current);
        }
      }, 100); // 100ms delay
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [startSeconds, playerReady, youtubeId]);

  // Control playback
  useEffect(() => {
    if (
      playerReady &&
      ytPlayer.current &&
      typeof ytPlayer.current.getPlayerState === 'function' &&
      typeof ytPlayer.current.playVideo === 'function' &&
      typeof ytPlayer.current.pauseVideo === 'function'
    ) {
      try {
        const state = ytPlayer.current.getPlayerState();
        if (isPlaying && state !== 1) {
          console.log('Calling playVideo (isPlaying effect)', { youtubeId, playerReady, ytPlayer: ytPlayer.current });
          ytPlayer.current?.playVideo?.();
        } else if (!isPlaying && state === 1) {
          console.log('Calling pauseVideo (isPlaying effect)', { youtubeId, playerReady, ytPlayer: ytPlayer.current });
          ytPlayer.current?.pauseVideo?.();
        }
      } catch (err) {
        console.error('YouTube player error:', err, 'youtubeId:', youtubeId, 'playerReady:', playerReady, 'ytPlayer:', ytPlayer.current);
      }
    }
  }, [isPlaying, playerReady, youtubeId]);

  // Auto-play when youtubeId changes and isPlaying is true
  useEffect(() => {
    if (!youtubeId || typeof youtubeId !== 'string' || youtubeId.length === 0) {
      console.warn('YouTubeEmbed: youtubeId is missing or invalid:', youtubeId);
      return;
    }
    if (
      playerReady &&
      ytPlayer.current &&
      typeof ytPlayer.current.playVideo === 'function' &&
      isPlaying
    ) {
      try {
        console.log('Calling playVideo (youtubeId effect)', { youtubeId, playerReady, ytPlayer: ytPlayer.current });
        ytPlayer.current.playVideo();
      } catch (err) {
        console.error('YouTube player error:', err, 'youtubeId:', youtubeId, 'playerReady:', playerReady, 'ytPlayer:', ytPlayer.current);
      }
    }
  }, [youtubeId, isPlaying, playerReady]);

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      {youtubeId && typeof youtubeId === 'string' && youtubeId.length > 0 ? (
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
      ) : (
        <div style={{ color: 'white', textAlign: 'center', padding: 20 }}>
          No video selected.
        </div>
      )}
    </div>
  )
}

