
import Image from "next/image";
import Link from "next/link";
import { Music, Users, ThumbsUp, ChevronRight, Share2, Sparkles } from "lucide-react"


const Hero = () => {
  return (
<section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  Redefine Your Music Streams
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Let Your Fans Choose the{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Music You Stream
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400">
                    Create interactive streams where your audience votes on what plays next.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-8 text-sm font-medium text-white shadow transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  >
                    See Demo
                  </Link>
                </div>
                <div className="flex items-center gap-8 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>10K+ Active Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    <span>1M+ Songs Played</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Music festival crowd"
                  className="object-cover"
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </section>
  )  
  
};

export default Hero;