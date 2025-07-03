"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AddSongForm({ onSongAdded, roomId }: { onSongAdded?: () => void; roomId: string }) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/streams", {
        method: "POST",
        body: JSON.stringify({
          url: youtubeUrl,
          roomId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add stream");

      setYoutubeUrl("");
      toast.success("Song added successfully!");
      
      // Refresh the queue
      if (onSongAdded) {
        onSongAdded();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to add song");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="bg-[#faf6fe] dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
        <Plus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        Add Stream
      </h2>
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex gap-2">
      <Input
        type="text"
        placeholder="YouTube or Spotify URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Song"}
      </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
       <p className="text-sm text-gray-600 dark:text-gray-400">
          Paste a YouTube video URL to add to your stream queue
        </p>
    </form>
    </div>
  );
}
