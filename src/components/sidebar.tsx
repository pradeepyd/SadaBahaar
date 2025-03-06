import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Headphones, Flame, Radio, Music, Disc, Zap, Guitar, Mic2, Heart, Clock, Upload } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("border-r bg-card", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Discover</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Headphones className="mr-2 h-4 w-4" />
              For You
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Flame className="mr-2 h-4 w-4" />
              Trending
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Radio className="mr-2 h-4 w-4" />
              New Releases
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Categories</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Music className="mr-2 h-4 w-4" />
              Pop
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Disc className="mr-2 h-4 w-4" />
              Hip Hop
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Zap className="mr-2 h-4 w-4" />
              Electronic
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Guitar className="mr-2 h-4 w-4" />
              Rock
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Mic2 className="mr-2 h-4 w-4" />
              Jazz
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Your Library</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Heart className="mr-2 h-4 w-4" />
              Liked Streams
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Recently Played
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Your Uploads
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

