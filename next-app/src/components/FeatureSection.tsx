import { Music, Share2, Users } from "lucide-react"
import FeatureCard from "./FeatureCard"


const FeatureSection = () => {
    return (
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Features for Engagement</h2>
          <p className="max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
            Create interactive music experiences that keep your audience coming back
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <FeatureCard
            icon={<Music className="h-5 w-5" />}
            title="Fan-Driven Playlists"
            description="Let your audience vote on songs, creating a collaborative playlist."
            gradient="from-purple-500 to-indigo-500"
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            title="Community Building"
            description="Foster a sense of community through shared music experiences."
            gradient="from-pink-500 to-rose-500"
          />
          <FeatureCard
            icon={<Share2 className="h-5 w-5" />}
            title="Seamless Integration"
            description="Works with popular streaming platforms and services."
            gradient="from-blue-500 to-cyan-500"
          />
        </div>
      </div>
    </section>
    )
  }
  export default FeatureSection;