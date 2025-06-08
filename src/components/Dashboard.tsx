"use client";

import { useEffect, useState } from "react";
import { Music, Share2, SkipForward } from "lucide-react";
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
import axios from "axios";
import { AddSongForm } from "./add-song-form";
import { useUser } from "@clerk/nextjs";

interface video {
  id: string;
  title: string;
  youtubeId: string;
  upvotes: number;
  downvotes: number;
  thumbnail?: string;
  haveUpvoted:boolean;
}

// const initialSongs: Song[] = [
//   {
//     id: "1",
//     title: "Lofi Hip Hop - Beats to Relax/Study to",
//     artist: "Lofi Girl",
//     youtubeId: "5qap5aO4i9A",
//     upvotes: 15,
//     downvotes: 2,
//     thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
//   },
//   {
//     id: "2",
//     title: "Chill Mix - Lo-fi Beats",
//     artist: "ChilledCow",
//     youtubeId: "DWcJFNfaw9c",
//     upvotes: 8,
//     downvotes: 1,
//     thumbnail: "https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg",
//   },
//   {
//     id: "3",
//     title: "Jazz Vibes for Work & Study",
//     artist: "Cafe Music BGM",
//     youtubeId: "Dx5qFachd3A",
//     upvotes: 5,
//     downvotes: 0,
//     thumbnail: "https://i.ytimg.com/vi/Dx5qFachd3A/hqdefault.jpg",
//   },
//   {
//     id: "4",
//     title: "Deep Focus Music",
//     artist: "Concentration Music",
//     youtubeId: "tfBVp0Zi2iE",
//     upvotes: 12,
//     downvotes: 3,
//     thumbnail: "https://i.ytimg.com/vi/tfBVp0Zi2iE/hqdefault.jpg",
//   },
//   {
//     id: "5",
//     title: "Ambient Study Music",
//     artist: "Relaxing Soundscapes",
//     youtubeId: "sjkrrmBnpGE",
//     upvotes: 7,
//     downvotes: 1,
//     thumbnail: "https://i.ytimg.com/vi/sjkrrmBnpGE/hqdefault.jpg",
//   },
//   {
//     id: "6",
//     title: "Peaceful Piano & Soft Rain Sounds",
//     artist: "Relaxing Music",
//     youtubeId: "XYuLIoWWsIc",
//     upvotes: 20,
//     downvotes: 2,
//     thumbnail: "https://i.ytimg.com/vi/XYuLIoWWsIc/hqdefault.jpg",
//   },
//   {
//     id: "7",
//     title: "Acoustic Guitar Instrumentals",
//     artist: "Acoustic Tunes",
//     youtubeId: "bpA_5a0miWk",
//     upvotes: 9,
//     downvotes: 1,
//     thumbnail: "https://i.ytimg.com/vi/bpA_5a0miWk/hqdefault.jpg",
//   },
// ];

export function CreatorDashboard() {
  const {user} = useUser();
  const REFRESH_TIME = 10 * 1000;
  const [inputLink,setInputLink] = useState('');
  const [queue,setQueue] = useState<video[]>([]);
  const [currentSong, setCurrentSong] = useState<video | null>(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // async function refreshFunction() {
  //   try {
  //     const res = await fetch("/api/streams/myStreams",{
  //       credentials:"include"
  //       })
  //     const json = await res.json();
  //     setQueue(json.streams)
  //   } catch (error: any) {
  //     console.error(
  //       "Error fetching streams:",
  //       error.response?.data || error.message
  //     );
  //   }
  // }
  // useEffect(() => {
  //   refreshFunction(); // Initial fetch
  // }, []);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newVideo:video = {
  //     id: String(queue.length + 1),
  //     title: `new song ${queue.length + 1}`,
  //     upvotes: 0,
  //     youtubeId: "",
  //     downvotes: 0,
  //     haveUpvoted: false
  //   }
  //   setQueue([...queue,newVideo])
  //   setInputLink('')
  // }

  // const handleVote = (id:string,isUpvote:boolean) => {
  //   setQueue(queue.map(video => video.id === id ? {
  //     ...video,
  //     upvotes:isUpvote ? video.upvotes + 1 :video.upvotes,
  //   }
  // :video
  // ).sort((a,b) => (b.upvotes) - (a.upvotes)))

  // fetch("api/streams/upvotes",{
  //   method:"POST",
  //   body:JSON.stringify({
  //     streamId : id
  //   })
  // })
  // }
  if (!user) {
  return <div>Not logged in</div>;
}
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-6 mr-2 ml-2">
      <div className="space-y-6 overflow-y-auto">
        <AddSongForm creatorId={user.id} />
        <div className="bg-[#faf6fe] dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Now Playing
              </h2>
            </div>
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
                  <Button>Copy</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {currentSong ? (
            <>
              <YouTubeEmbed
                youtubeId={currentSong.youtubeId}
                onEnded={() => {}}
              />
              <div className="mt-4">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {currentSong.title}
                </h3>
                {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSong}
                </p> */}
              </div>
            </>
          ) : (
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                No song currently playing
              </p>
            </div>
          )}
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600">
            <SkipForward className="h-4 w-4 mr-2" />
            Play Next
          </Button>
        </div>
        {/* <div className="lg:hidden">
          <SongQueue songs={songs} onUpvote={() => {}} onDownvote={() => {}} />
        </div> */}
      </div>
      {/* <ExpandableCardDemo/> */}
      <div className="">
        {/* <SongQueue songs={queue} onUpvote={() => {handleVote}} onDownvote={() => {}} /> */}
      </div>
    </div>
  );
}
