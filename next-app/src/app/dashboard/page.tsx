"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Play, Heart, Youtube, Headphones, Loader2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "My Room" })
      });
      const data = await res.json();
      if (data && data.room && data.room.id) {
        router.push(`/room/${data.room.id}`);
      } else if (data && data.id) {
        router.push(`/room/${data.id}`);
      } else {
        alert("Failed to create room");
      }
    } catch {
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
          <span className="text-lg text-white font-semibold">Creating your room…</span>
        </div>
      )}
      <div className="container mx-auto px-2 py-4 h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full max-w-6xl">
          {/* Left Column - Welcome Section */}
          <div className="space-y-4 animate-fade-in px-2 lg:px-4">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                Welcome to Fanmix
              </h1>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed max-w-md">
                Create collaborative music rooms where everyone votes on the next song. 
                Let the crowd decide what plays next in real-time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleCreateRoom}
                disabled={loading}
              >
                <Music className="mr-2 h-5 w-5" />
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </div>
            {/* Platform Integration */}
            <div className="space-y-2 pt-6">
              <h3 className="text-base font-medium text-gray-400">Stream from your favorite platforms</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-red-500">
                  <Youtube className="h-5 w-5" />
                  <span className="text-white text-sm">YouTube</span>
                </div>
                <div className="flex items-center space-x-2 text-green-500">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Music className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white text-sm">Spotify</span>
                </div>
              </div>
            </div>
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Play className="h-4 w-4 text-green-400" />
                <span>Real-time streaming</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Heart className="h-4 w-4 text-red-400" />
                <span>Upvote system</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Music className="h-4 w-4 text-blue-400" />
                <span>Queue control</span>
              </div>
            </div>
          </div>
          {/* Right Column - Visual Elements */}
          <div className="relative flex items-center justify-center px-2 lg:px-4">
            {/* Main visualization card - Music themed background */}
            <Card className="relative bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#18181b] border border-neutral-800 p-4 lg:p-6 backdrop-blur-sm w-full max-w-md h-[420px] lg:h-[430px] overflow-hidden shadow-xl">
              {/* Music pattern background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4">
                  <Headphones className="h-10 w-10 text-purple-400" />
                </div>
                <div className="absolute bottom-4 left-6">
                  <Music className="h-7 w-7 text-blue-400" />
                </div>
                <div className="absolute bottom-4 right-6">
                  <Play className="h-7 w-7 text-green-400" />
                </div>
                <div className="absolute top-1/3 right-1/3">
                  <Headphones className="h-7 w-7 text-pink-300" />
                </div>
              </div>
              <div className="relative z-10 space-y-6">
                {/* Mock music player interface */}
                <div className="text-center space-y-2">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                    <Headphones className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Now Playing</h3>
                    <p className="text-gray-300 text-base">Collaborative Queue Active</p>
                  </div>
                </div>
                {/* Mock queue with votes */}
                <div className="space-y-2">
                  <h4 className="text-base font-medium text-white flex items-center gap-2">
                    <Music className="h-4 w-4 text-purple-400" />
                    Up Next
                  </h4>
                  {[
                    { song: "Summer Vibes", votes: 12, platform: "youtube" },
                    { song: "Midnight Dreams", votes: 8, platform: "spotify" },
                    { song: "Electric Pulse", votes: 5, platform: "youtube" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/40 rounded-lg p-3 border border-purple-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-base">{item.song}</span>
                          {item.platform === "youtube" ? (
                            <Youtube className="h-3 w-3 text-red-500" />
                          ) : (
                            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                              <Music className="h-1.5 w-1.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-gray-300 text-base">{item.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            {/* Floating music icons animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { Icon: Music, delay: '0s', position: { left: '10%', top: '10%' } },
                { Icon: Headphones, delay: '0.5s', position: { left: '80%', top: '15%' } },
                { Icon: Play, delay: '1.5s', position: { left: '85%', top: '75%' } },
                { Icon: Music, delay: '2s', position: { left: '50%', top: '5%' } },
                { Icon: Headphones, delay: '2.5s', position: { left: '5%', top: '50%' } },
                { Icon: Play, delay: '3.5s', position: { left: '25%', top: '85%' } }
              ].map((item, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce text-purple-400 opacity-40"
                  style={{
                    left: item.position.left,
                    top: item.position.top,
                    animationDelay: item.delay,
                    animationDuration: '4s'
                  }}
                >
                  <item.Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}


