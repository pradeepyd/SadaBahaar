"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Music, Share2, SkipForward, Play, Pause, Hourglass, Menu } from "lucide-react";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { SongQueue } from "@/components/song-queue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AddSongForm } from "./add-song-form";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Sidebar } from "@/components/sidebar";
import { differenceInSeconds, subMinutes, addMinutes } from 'date-fns';
import { CreateRoomButton } from "@/components/CreateRoomButton";
import { useRouter } from "next/navigation";

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

interface CreatorDashboardProps {
  roomId?: string;
}

export function CreatorDashboard({ roomId }: CreatorDashboardProps) {
  const { user } = useUser();
  const [queue, setQueue] = useState<Stream[]>([]);
  const [currentSong, setCurrentSong] = useState<Stream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tab, setTab] = useState<string>("queue");
  const [liked, setLiked] = useState<Stream[]>([]);
  const [uploads, setUploads] = useState<Stream[]>([]);
  const [recent, setRecent] = useState<Stream[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const manualCurrentSongIdRef = useRef<string | null>(null);
  const router = useRouter();
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinValue, setJoinValue] = useState("");
  const [joinError, setJoinError] = useState("");
  const justEndedRef = useRef<string | null>(null);
  const [lastPlayedSongId, setLastPlayedSongId] = useState<string | null>(null);
  const currentSongRef = useRef<Stream | null>(null);
  const [currentSongStartedAt, setCurrentSongStartedAt] = useState<string | null>(null);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/room/" + roomId : "";

  // Fetch streams from API
  const fetchStreams = useCallback(async () => {
    if (!user?.id || !roomId) return;
    try {
      const res = await fetch(`/api/streams?roomId=${roomId}`);
      const data = await res.json();
      if (res.ok) {
        const sortedStreams = data.streams.sort((a: Stream, b: Stream) => {
          const aScore = a.upvotes - a.downvotes;
          const bScore = b.upvotes - b.downvotes;
          return bScore - aScore;
        });
        setQueue(sortedStreams);
        setCurrentSongStartedAt(data.currentSongStartedAt || null);
        setCreatorId(data.creatorId || null);
        // Only set currentSong if it is null or if it was removed from the queue (not just because the order changed)
        const cur = currentSongRef.current;
        if (!cur && sortedStreams.length > 0) {
          setCurrentSong(sortedStreams[0]);
        } else if (
          cur &&
          !sortedStreams.some((s: Stream) => s.id === cur.id) &&
          sortedStreams.length > 0
        ) {
          setCurrentSong(sortedStreams[0]);
        } else {
          // Do not update currentSong if it is still present in the queue, even if the order changed
        }
        if (manualCurrentSongIdRef.current) {
          const manualSong = sortedStreams.find((s: Stream) => s.id === manualCurrentSongIdRef.current);
          if (manualSong) {
            if (!cur || cur.id !== manualSong.id) {
              setCurrentSong(manualSong);
            }
            return;
          } else {
            manualCurrentSongIdRef.current = null;
            // Do not set currentSong to firstAvailable here; let the normal logic handle it
            return;
          }
        }
      } else {
        toast.error("Failed to fetch streams");
      }
    } catch {
      toast.error("Error fetching streams");
    }
  }, [user?.id, roomId]);

  // Handle upvote
  const handleUpvote = useCallback(async (id: string) => {
    try {
      await fetch("/api/streams/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamId: id, roomId }),
      });
      fetchStreams(); // Refresh the queue
    } catch {
      toast.error("Failed to register vote");
    }
  }, [roomId, fetchStreams]);

  // Handle downvote
  const handleDownvote = useCallback(async (id: string) => {
    try {
      await fetch("/api/streams/downvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamId: id, roomId }),
      });
      fetchStreams(); // Refresh the queue
    } catch {
      toast.error("Failed to register vote");
    }
  }, [roomId, fetchStreams]);

  // Helper: sort queue by votes and recency
  const getSortedQueue = useCallback(() => {
    return [...queue].sort((a, b) => {
      const aScore = a.upvotes - a.downvotes;
      const bScore = b.upvotes - b.downvotes;
      if (bScore !== aScore) return bScore - aScore;
      return new Date(a.lastPlayedAt || 0).getTime() - new Date(b.lastPlayedAt || 0).getTime();
    });
  }, [queue]);

  // Helper: find next available song (no cooldown)
  const findNextAvailableSong = useCallback((fromId: string | null) => {
    const sorted = getSortedQueue();
    if (!sorted.length) return null;
    if (!fromId) return sorted[0];
    const idx = sorted.findIndex(s => s.id === fromId);
    // Try to find the next song that is NOT the last played
    for (let i = 1; i <= sorted.length; i++) {
      const nextIdx = (idx + i) % sorted.length;
      if (sorted[nextIdx].id !== lastPlayedSongId) {
        return sorted[nextIdx];
      }
    }
    // If all songs have been played, allow repeat
    return sorted[(idx + 1) % sorted.length];
  }, [getSortedQueue, lastPlayedSongId]);

  // Countdown timer for next available song
  const getNextAvailableTime = () => {
    const now = new Date();
    let minTime = null;
    for (const song of queue) {
      if (song.lastPlayedAt) {
        const availableAt = addMinutes(new Date(song.lastPlayedAt), 5);
        const diff = differenceInSeconds(availableAt, now);
        if (diff > 0 && (minTime === null || diff < minTime)) {
          minTime = diff;
        }
      }
    }
    return minTime;
  };

  // Handle song ending
  const handleSongEnded = async () => {
    if (!currentSong || !roomId) return;
    await fetch('/api/streams/markPlayed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId: currentSong.id, roomId })
    });
    setLastPlayedSongId(currentSong.id);
    justEndedRef.current = currentSong.id;
    await fetchStreams();
  };

  // After queue updates, if a song just ended, advance to the next available song
  useEffect(() => {
    if (justEndedRef.current) {
      const nextSong = findNextAvailableSong(justEndedRef.current);
      if (nextSong) {
        setCurrentSong(nextSong);
        manualCurrentSongIdRef.current = null;
      } else if (queue.length === 0) {
        setCurrentSong(null);
        manualCurrentSongIdRef.current = null;
        setIsPlaying(false);
        toast.info("No songs in the queue. Please add a new song.");
      } else {
        // All songs are in cooldown, but keep showing the last played song
        setIsPlaying(false);
        toast.info("All songs are in cooldown. Please wait or add a new song.");
      }
      justEndedRef.current = null;
    }
  }, [queue, lastPlayedSongId, findNextAvailableSong]);

  // Handle play next
  const handlePlayNext = async () => {
    if (!currentSong || !roomId) return;
    await fetch('/api/streams/markPlayed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId: currentSong.id, roomId })
    });
    await fetchStreams();
    const nextSong = findNextAvailableSong(currentSong.id);
    if (nextSong) {
      setCurrentSong(nextSong);
      manualCurrentSongIdRef.current = null;
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // WebSocket setup for real-time updates
  useEffect(() => {
    if (!user?.id) return;
    if (wsRef.current) return;
    const ws = new window.WebSocket("ws://localhost:3001");
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "vote" || data.type === "queue") {
          fetchStreams();
        }
      } catch {
        // ignore
      }
    };
    ws.onclose = () => {
      wsRef.current = null;
    };
    return () => {
      ws.close();
    };
  }, [user?.id, fetchStreams]);

  // Initial fetch
  useEffect(() => {
    fetchStreams();
  }, [user?.id, fetchStreams]);

  // Refresh queue every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStreams();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, fetchStreams]);

  // Fetch liked streams
  const fetchLiked = useCallback(async () => {
    if (!user?.id || !roomId) return;
    try {
      const res = await fetch(`/api/streams/liked?roomId=${roomId}`);
      const data = await res.json();
      if (res.ok) setLiked(data.streams);
    } catch (error) {
      console.error('Error fetching liked streams:', error);
    }
  }, [user?.id, roomId]);
  // Fetch uploads
  const fetchUploads = useCallback(async () => {
    if (!user?.id || !roomId) return;
    try {
      const res = await fetch(`/api/streams/uploads?roomId=${roomId}`);
      const data = await res.json();
      if (res.ok) setUploads(data.streams);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  }, [user?.id, roomId]);
  // Fetch recently played
  const fetchRecent = useCallback(async () => {
    if (!user?.id || !roomId) return;
    try {
      const res = await fetch(`/api/streams/recent?roomId=${roomId}`);
      const data = await res.json();
      if (res.ok) setRecent(data.streams);
    } catch (error) {
      console.error('Error fetching recent streams:', error);
    }
  }, [user?.id, roomId]);

  // Add useEffect to fetch tab data
  useEffect(() => {
    if (tab === "liked") fetchLiked();
    if (tab === "uploads") fetchUploads();
    if (tab === "recent") fetchRecent();
  }, [tab, user?.id, fetchLiked, fetchUploads, fetchRecent]);

  // Handle manual song selection
  const handleSelectSong = (song: Stream) => {
    // Only allow if song is not in cooldown
    if (!song.lastPlayedAt || new Date(song.lastPlayedAt) < subMinutes(new Date(), 5)) {
      setCurrentSong(song);
      manualCurrentSongIdRef.current = song.id; // Only set on manual selection
      setIsPlaying(true);
    }
  };

  // Add this effect after all state declarations
  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
    }
  }, [currentSong]);

  if (!user) {
    return <div>Not logged in</div>;
  }

  // Show welcome/empty state if not in a room
  if (!roomId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Sadabahaar!</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300 max-w-md">
          Create a new room to start a collaborative music session, or join an existing room with a code or link.
        </p>
        <div className="flex flex-col gap-4 items-center w-full max-w-xs">
          <CreateRoomButton />
          {/* Only show Join Room UI if not in a room */}
          {!showJoinInput && (
            <Button variant="outline" className="px-6 py-2 text-lg w-full" onClick={() => setShowJoinInput(true)}>
              Join Room
            </Button>
          )}
          {showJoinInput && (
            <form
              className="flex flex-col gap-2 w-full"
              onSubmit={e => {
                e.preventDefault();
                setJoinError("");
                // Accept either a roomId or a full link
                let id = joinValue.trim();
                if (id.startsWith("http")) {
                  try {
                    const url = new URL(id);
                    const parts = url.pathname.split("/");
                    id = parts[parts.length - 1] || parts[parts.length - 2];
                  } catch {
                    setJoinError("Invalid link");
                    return;
                  }
                }
                if (!id) {
                  setJoinError("Please enter a room ID or link");
                  return;
                }
                router.push(`/room/${id}`);
              }}
            >
              <Input
                placeholder="Enter room ID or link"
                value={joinValue}
                onChange={e => setJoinValue(e.target.value)}
                className="w-full"
              />
              {joinError && <div className="text-red-500 text-sm">{joinError}</div>}
              <div className="flex gap-2">
                <Button type="submit" className="w-full">Join</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowJoinInput(false); setJoinValue(""); setJoinError(""); }}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4">
      {/* Prominent Share Room button at the top */}
      <div className="flex justify-end items-center mb-4 px-4">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden mr-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open sidebar menu"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Room link copied to clipboard");
          }}
        >
          <Share2 className="h-4 w-4" />
          Share Room
        </Button>
      </div>
      {/* Main dashboard content */}
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar onSelect={setTab} selectedTab={tab} />
        </div>
        {/* Sidebar Drawer for mobile */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close sidebar menu"
            />
            {/* Drawer */}
            <div className="relative bg-card w-64 h-full shadow-lg animate-slide-in-left">
              <button
                className="absolute top-2 right-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close sidebar menu"
              >
                ✕
              </button>
              <Sidebar onSelect={(tab) => { setTab(tab); setDrawerOpen(false); }} selectedTab={tab} />
            </div>
          </div>
        )}
        <div className="flex-1 ml-4">
          {tab === "queue" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-6 mr-2 ml-2">
              <div className="space-y-6 overflow-y-auto">
                <AddSongForm onSongAdded={fetchStreams} roomId={roomId!} />
                <div className="bg-[#faf6fe] dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Now Playing
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlayPause}
                        disabled={!currentSong || user?.id !== creatorId}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
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
                            <DialogDescription>
                              Share this link with others to let them join your stream
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-2">
                            <Input
                              readOnly
                              value={shareUrl}
                              onClick={(e) => e.currentTarget.select()}
                            />
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                toast.success("Link copied to clipboard");
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {currentSong ? (
                    <>
                      <YouTubeEmbed
                        youtubeId={currentSong.extractedId}
                        onEnded={handleSongEnded}
                        isPlaying={isPlaying}
                        startSeconds={(() => {
                          if (!currentSongStartedAt) return 0;
                          const started = new Date(currentSongStartedAt).getTime();
                          const now = Date.now();
                          const offset = Math.floor((now - started) / 1000);
                          return offset > 0 ? offset : 0;
                        })()}
                      />
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {currentSong.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Upvotes: {currentSong.upvotes}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Downvotes: {currentSong.downvotes}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 animate-fade-in">
                      <Hourglass className="h-12 w-12 text-purple-400 animate-pulse mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold">
                        {queue.length > 0
                          ? "All songs are in cooldown."
                          : "No song currently playing."}
                      </p>
                      {queue.length > 0 ? (
                        <>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">Please wait for a song to become available or add a new song to the queue.</p>
                          {/* Countdown timer */}
                          {getNextAvailableTime() !== null && (
                            <p className="text-purple-600 font-bold text-lg">Next song available in {Math.floor(getNextAvailableTime()!/60)}:{(getNextAvailableTime()!%60).toString().padStart(2, '0')}</p>
                          )}
                          <Button onClick={() => setTab('queue')} className="mt-2">Add Song</Button>
                        </>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Add a song to get started!</p>
                      )}
                    </div>
                  )}
                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
                    onClick={handlePlayNext}
                    disabled={queue.length <= 1}
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Play Next
                  </Button>
                </div>
              </div>
              <div className="">
                <SongQueue 
                  songs={queue} 
                  onUpvote={handleUpvote} 
                  onDownvote={handleDownvote} 
                  currentSongId={currentSong?.id}
                  onSelectSong={handleSelectSong}
                  roomId={roomId!}
                />
              </div>
            </div>
          )}
          {tab === "liked" && (
            <SongQueue songs={liked} onUpvote={handleUpvote} onDownvote={handleDownvote} roomId={roomId!} />
          )}
          {tab === "uploads" && (
            <SongQueue songs={uploads} onUpvote={handleUpvote} onDownvote={handleDownvote} roomId={roomId!} />
          )}
          {tab === "recent" && (
            <SongQueue songs={recent} onUpvote={handleUpvote} onDownvote={handleDownvote} roomId={roomId!} />
          )}
          {["trending", "new"].includes(tab) && (
            <div className="p-8 text-center text-gray-500">This feature is coming soon!</div>
          )}
        </div>
      </div>
    </div>
  );
}
