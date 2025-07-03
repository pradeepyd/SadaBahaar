import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Headphones, Flame, Radio, Heart, Clock, Upload } from "lucide-react"
import { useRef, useEffect } from "react"

interface SidebarProps {
  className?: string;
  onSelect?: (tab: string) => void;
  selectedTab?: string;
}

export function Sidebar({ className, onSelect, selectedTab }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onSelect?.("queue");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onSelect]);

  return (
    <div ref={sidebarRef} className={cn("border-r bg-card w-44 min-w-[8rem] max-w-[12rem]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Discover</h2>
          <div className="space-y-1">
            <Button variant={selectedTab === "queue" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onSelect?.("queue")}>
              <Headphones className="mr-2 h-4 w-4" />
              For You
            </Button>
            <Button variant={selectedTab === "trending" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onSelect?.("trending")}>
              <Flame className="mr-2 h-4 w-4" />
              Trending
            </Button>
            <Button variant={selectedTab === "new" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onSelect?.("new")}>
              <Radio className="mr-2 h-4 w-4" />
              New Releases
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Your Library</h2>
          <div className="space-y-1">
            <Button variant={selectedTab === "liked" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onSelect?.("liked")}>
              <Heart className="mr-2 h-4 w-4" />
              Liked Streams
            </Button>
            <Button variant={selectedTab === "recent" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onSelect?.("recent")}>
              <Clock className="mr-2 h-4 w-4" />
              Recently Played
            </Button>
            <Button variant={selectedTab === "uploads" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => onSelect?.("uploads")}>
              <Upload className="mr-2 h-4 w-4" />
              Your Uploads
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

